import typeService from "./type-service";
import abilityService from "./ability-service";
import statService from "./stat-service";
import { NameLookupService } from "./service";
import { Species, SpeciesBody } from "../models/species";
import { SpeciesAdapter } from "../adapters/species-adapter";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

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

    protected override async processRequestBody(body: SpeciesBody): Promise<SpeciesBody>
    {
        const processed = { ...body };

        if (body.types)
        {
            processed.type1Id = await typeService.getIdByName(body.types[0]);
            if (body.types[1]) processed.type2Id = await typeService.getIdByName(body.types[1]);
        }

        return processed;
    }

    protected override async adaptToModel(row: RowDataPacket): Promise<Species>
    {
        row.abilities = await abilityService.getReferencesBySpeciesId(row.species_id);
        row.base_stats = await statService.getReferencesBySpeciesId(row.species_id);
        return super.adaptToModel(row);
    }

    protected override async insertRelations(connection: PoolConnection, id: number, body: SpeciesBody): Promise<void>
    {
        await this.insertAbilityRelations(connection, id, body);
        await this.insertBaseStatRelations(connection, id, body);
    }

    private async insertAbilityRelations(connection: PoolConnection, id: number, body: SpeciesBody)
    {
        const values = [];

        if (body.abilities)
        {
            for (const abilityName of body.abilities)
            {
                const index = body.abilities.indexOf(abilityName);
                const abilityId = await abilityService.getIdByName(abilityName);
                values.push([id, abilityId, 0, index + 1]);

                await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = FALSE", [id]);
            }
        }

        if (body.hiddenAbility)
        {
            const hiddenAbilityId = await abilityService.getIdByName(body.hiddenAbility);
            values.push([id, hiddenAbilityId, 1, 3]);

            await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = TRUE", [id]);
        }

        if (values.length > 0)
        {
            await connection.query("INSERT INTO species_abilities VALUES ?", [values]);
        }
    }

    private async insertBaseStatRelations(connection: PoolConnection, id: number, body: SpeciesBody)
    {
        const statCount = await statService.count();

        if (body.baseStats)
        {
            if (body.baseStats.length != statCount)
            {
                throw new Error(`Base stat count must be exactly ${statCount}.`);
            }

            const values: number[][] = [];

            body.baseStats.forEach((stat, index) =>
            {
                values.push([id, index + 1, stat]);
            });

            await connection.query("DELETE FROM species_base_stats WHERE species_id = ?", [id]);
            await connection.query("INSERT INTO species_base_stats VALUES ?", [values]);
        }
    }
}

export default new SpeciesService();
