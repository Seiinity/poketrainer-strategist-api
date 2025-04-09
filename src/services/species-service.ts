import typeService from "./type-service";
import { NameLookupService } from "./service";
import { Species, SpeciesBody } from "../models/species";
import { SpeciesAdapter } from "../adapters/species-adapter";
import db from "../db/mysql";
import { RowDataPacket } from "mysql2";
import abilityService from "./ability-service";
import { MySQLOperation } from "../types/enums";

class SpeciesService extends NameLookupService<Species, SpeciesBody>
{
    protected adapter = new SpeciesAdapter();
    protected tableName = "species";
    protected tableAlias = "sp";
    protected idField = "species_id";
    protected searchField = "name";
    protected nameField = "name";

    protected baseSelectQuery = `
        SELECT
            sp.*,
            tp1.type_id AS type1_id, tp1.name AS type1_name,
            tp2.type_id AS type2_id, tp2.name AS type2_name,
            gr.male_rate, gr.female_rate,
            gn.name AS generation
        FROM species sp
            LEFT JOIN types tp1 ON sp.type_1_id = tp1.type_id
            LEFT JOIN types tp2 ON sp.type_2_id = tp2.type_id
            LEFT JOIN gender_ratios gr ON sp.gender_ratio_id = gr.gender_ratio_id
            LEFT JOIN generations gn ON sp.generation_id = gn.generation_id
    `;

    protected async processRequestBody(body: SpeciesBody): Promise<SpeciesBody>
    {
        const processed = { ...body };

        if (body.typeNames)
        {
            processed.type1Id = await typeService.getIdByName(body.typeNames[0]);
            processed.type2Id = body.typeNames[1] ? await typeService.getIdByName(body.typeNames[1]) : null;
        }

        return processed;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<Species>
    {
        row.abilities = await abilityService.getReferencesFromSpeciesId(row.species_id);
        return super.adaptToModel(row);
    }

    async update(id: number, body: SpeciesBody): Promise<Species | null>
    {
        const connection = await db.getConnection();

        try
        {
            await connection.beginTransaction();
            await super.update(id, body, connection);
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw error;
        }

        try
        {
            const values = [];

            if (body.abilityNames)
            {
                for (const abilityName of body.abilityNames)
                {
                    const index = body.abilityNames.indexOf(abilityName);
                    const abilityId = await abilityService.getIdByName(abilityName);
                    values.push([id, abilityId, 0, index + 1]);

                    await db.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = FALSE", [id]);
                }
            }

            if (body.hiddenAbilityName)
            {
                const hiddenAbilityId = await abilityService.getIdByName(body.hiddenAbilityName);
                values.push([id, hiddenAbilityId, 1, 3]);

                await db.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = TRUE", [id]);
            }

            if (values.length > 0)
            {
                await db.query("INSERT INTO species_abilities VALUES ?", [values]);
            }

            connection.commit();
            connection.release();

            return await this.getById(id) as Species;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw this.handleError(error, body, MySQLOperation.Update, id);
        }
    }
}

export default new SpeciesService();
