import db from "../db/mysql";
import speciesService from "./species-service";
import teamService from "./team-service";
import statService from "./stat-service";
import { Service } from "./service";
import { Pokemon, PokemonBody, PokemonReference } from "../models/pokemon";
import { PokemonAdapter } from "../adapters/pokemon-adapter";
import { RowDataPacket } from "mysql2";
import { MySQLOperation } from "../types/enums";
import { PoolConnection } from "mysql2/promise";
import { getLastInsertId } from "../utils/mysql-generation";

export class PokemonService extends Service<Pokemon, PokemonBody>
{
    protected adapter = new PokemonAdapter();
    protected tableName = "pokemon";
    protected tableAlias = "pk";
    protected idField = "pokemon_id";
    protected searchField = "p.nickname";

    protected baseSelectQuery = `
        SELECT
            pk.pokemon_id, pk.nickname,
            sp.species_id, sp.name AS species_name,
            tm.team_id, tm.name AS team_name
        FROM pokemon pk
            LEFT JOIN species sp ON pk.species_id = sp.species_id
            LEFT JOIN teams tm ON pk.team_id = tm.team_id
    `;

    protected async processRequestBody(body: PokemonBody): Promise<PokemonBody>
    {
        const processed = { ...body };

        if (body.speciesName)
        {
            processed.speciesId = await speciesService.getIdByName(body.speciesName);
        }

        if (body.teamId)
        {
            const team = await teamService.getById(body.teamId);
            if (team == null) return Promise.reject(new Error(`No team found with ID ${body.teamId}.`));
        }

        return processed;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<Pokemon>
    {
        row.stats = await statService.getReferencesByPokemonId(row.pokemon_id);
        return super.adaptToModel(row);
    }

    async getReferencesByTeamId(teamId: number): Promise<PokemonReference[]>
    {
        try
        {
            const rows = await db.queryTyped<RowDataPacket>
            (
                `SELECT
                    p.pokemon_id, p.nickname,
                    s.name AS species_name
                FROM pokemon p
                LEFT JOIN species s ON p.species_id = s.species_id
                WHERE p.team_id = ?`,
                [teamId]
            );

            return rows.map(row => this.adapter.referenceFromMySQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching Pokémon reference by team ID: ${(error as Error).message}`);
        }
    }

    async create(body: PokemonBody): Promise<Pokemon>
    {
        const connection = await db.getConnection();
        let id = 0;

        try
        {
            await connection.beginTransaction();
            await super.create(body, connection);
            id = await getLastInsertId(connection);
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw error;
        }

        try
        {
            await this.insertEVRelations(connection, id, body);

            connection.commit();
            connection.release();

            return await this.getById(id) as Pokemon;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw this.handleError(error, body, MySQLOperation.Create);
        }
    }

    async update(id: number, body: PokemonBody): Promise<Pokemon | null>
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
            await this.insertEVRelations(connection, id, body);

            connection.commit();
            connection.release();

            return await this.getById(id) as Pokemon;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();
            throw this.handleError(error, body, MySQLOperation.Update, id);
        }
    }

    private async insertEVRelations(connection: PoolConnection, id: number, body: PokemonBody)
    {
        const evCount = await statService.count();

        if (body.evs)
        {
            if (body.evs.length != evCount)
            {
                throw new Error(`EV count must be exactly ${evCount}.`);
            }

            const values: number[][] = [];

            body.evs.forEach((ev, index) =>
            {
                values.push([id, index + 1, ev]);
            });

            await connection.query("DELETE FROM pokemon_evs WHERE pokemon_id = ?", [id]);
            await connection.query("INSERT INTO pokemon_evs VALUES ?", [values]);
        }
    }
}

export default new PokemonService();
