import db from "../db/mysql";
import typeService from "./type-service";
import abilityService from "./ability-service";
import { NameLookupService } from "./service";
import { Species, SpeciesBody } from "../models/species";
import { SpeciesAdapter } from "../adapters/species-adapter";
import { RowDataPacket } from "mysql2";
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
            if (body.typeNames[1]) processed.type2Id = await typeService.getIdByName(body.typeNames[1]);
        }

        return processed;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<Species>
    {
        row.abilities = await abilityService.getReferencesFromSpeciesId(row.species_id);
        return super.adaptToModel(row);
    }

    async create(body: SpeciesBody): Promise<Species>
    {
        const connection = await db.getConnection();
        const id = body.id as number;

        try
        {
            await connection.beginTransaction();
            await super.create(body, connection);
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

            if (!body.abilityNames || !body.hiddenAbilityName)
            {
                await connection.rollback();
                connection.release();

                return Promise.reject("Invalid request body.");
            }

            for (const abilityName of body.abilityNames)
            {
                const index = body.abilityNames.indexOf(abilityName);
                const abilityId = await abilityService.getIdByName(abilityName);
                values.push([id, abilityId, 0, index + 1]);
            }

            const hiddenAbilityId = await abilityService.getIdByName(body.hiddenAbilityName);
            values.push([id, hiddenAbilityId, 1, 3]);

            await connection.query("DELETE FROM species_abilities WHERE species_id = ?", [id]); // Failsafe.
            await connection.query("INSERT INTO species_abilities VALUES ?", [values]);

            connection.commit();
            connection.release();

            return await this.getById(id) as Species;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw this.handleError(error, body, MySQLOperation.Create);
        }
    }

    async update(id: number, body: SpeciesBody): Promise<Species | null>
    {
        const connection = await db.getConnection();

        // Prevent ID manipulation.
        const { id: _, ...sanitisedBody } = body;
        body = sanitisedBody;

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

                    await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = FALSE", [id]);
                }
            }

            if (body.hiddenAbilityName)
            {
                const hiddenAbilityId = await abilityService.getIdByName(body.hiddenAbilityName);
                values.push([id, hiddenAbilityId, 1, 3]);

                await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = TRUE", [id]);
            }

            if (values.length > 0)
            {
                await connection.query("INSERT INTO species_abilities VALUES ?", [values]);
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
