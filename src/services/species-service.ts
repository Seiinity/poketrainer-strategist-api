import db from "../db/mysql";
import typeService from "./type-service";
import abilityService from "./ability-service";
import statService from "./stat-service";
import speciesAdapter from "../adapters/species-adapter";
import { NameLookupService } from "./service";
import { Species, SpeciesBody } from "../models/species";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import moveService from "./move-service";

class SpeciesService extends NameLookupService<Species, SpeciesBody>
{
    protected adapter = speciesAdapter;
    protected tableName = "species";
    protected tableAlias = "sp";
    protected idField = "species_id";
    protected searchField = "name";
    protected nameField = "name";

    protected baseSelectQuery = `
        SELECT
            sp.*,
            tp1.type_id AS type_1_id, tp1.name AS type_1_name,
            tp2.type_id AS type_2_id, tp2.name AS type_2_name,
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
            processed.type1Id = await typeService.nameLookup.getIdByName(body.types[0]);
            if (body.types[1]) processed.type2Id = await typeService.nameLookup.getIdByName(body.types[1]);
        }

        return processed;
    }

    protected override async adaptToModel(row: RowDataPacket): Promise<Species>
    {
        row.abilities = await abilityService.getBySpeciesId(row.species_id);
        row.base_stats = await statService.getBySpeciesId(row.species_id);
        row.learnset = await moveService.getBySpeciesId(row.species_id);
        return super.adaptToModel(row);
    }

    protected override async insertRelations(connection: PoolConnection, id: number, body: SpeciesBody): Promise<void>
    {
        await this.insertAbilityRelations(connection, id, body);
        await this.insertBaseStatRelations(connection, id, body);
        await this.insertLearnsetRelations(connection, id, body);
    }

    private async insertAbilityRelations(connection: PoolConnection, id: number, body: SpeciesBody): Promise<void>
    {
        const values = [];

        if (body.abilities)
        {
            for (const abilityName of body.abilities)
            {
                const index = body.abilities.indexOf(abilityName);
                const abilityId = await abilityService.nameLookup.getIdByName(abilityName);
                values.push([id, abilityId, 0, index + 1]);

                await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = FALSE", [id]);
            }
        }

        if (body.hiddenAbility)
        {
            const hiddenAbilityId = await abilityService.nameLookup.getIdByName(body.hiddenAbility);
            values.push([id, hiddenAbilityId, 1, 3]);

            await connection.query("DELETE FROM species_abilities WHERE species_id = ? AND is_hidden = TRUE", [id]);
        }

        if (values.length > 0)
        {
            await connection.query("INSERT INTO species_abilities VALUES ?", [values]);
        }
    }

    private async insertBaseStatRelations(connection: PoolConnection, id: number, body: SpeciesBody): Promise<void>
    {
        if (!body.baseStats) return;

        const statCount = await statService.count();

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

    private async insertLearnsetRelations(connection: PoolConnection, id: number, body: SpeciesBody): Promise<void>
    {
        if (!body.learnset) return;

        const values: number[][] = [];

        for (const move of body.learnset)
        {
            values.push([id, await moveService.nameLookup.getIdByName(move)]);
        }

        await connection.query("DELETE FROM species_learnsets WHERE species_id = ?", [id]);
        await connection.query("INSERT INTO species_learnsets VALUES ?", [values]);
    }

    async getByAbilityId(abilityId: number): Promise<RowDataPacket[]>
    {
        try
        {
            const query = `
                SELECT sp.species_id, sp.name, sa.is_hidden
                FROM species_abilities sa
                LEFT JOIN species sp ON sa.species_id = sp.species_id
                WHERE sa.ability_id = ?
            `;
            return await db.queryTyped<RowDataPacket>(query, [abilityId]);
        }
        catch (error)
        {
            throw new Error(`Error fetching species by ability ID: ${(error as Error).message}`);
        }
    }
}

export default new SpeciesService();
