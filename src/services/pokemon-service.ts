import db from "../db/mysql";
import speciesService from "./species-service";
import teamService from "./team-service";
import { Service } from "./service";
import { Pokemon, PokemonBody, PokemonReference } from "../models/pokemon";
import { PokemonAdapter } from "../adapters/pokemon-adapter";
import { RowDataPacket } from "mysql2";

export class PokemonService extends Service<Pokemon, PokemonBody>
{
    protected adapter = new PokemonAdapter();
    protected tableName = "pokemon";
    protected idField = "pokemon_id";
    protected searchField = "p.nickname";

    protected baseSelectQuery = `
        SELECT
            p.pokemon_id, p.nickname,
            s.species_id, s.name AS species_name,
            t.team_id, t.name AS team_name
        FROM pokemon p
            LEFT JOIN species s ON p.species_id = s.species_id
            LEFT JOIN teams t ON p.team_id = t.team_id
    `;

    protected async processRequestBody(body: PokemonBody): Promise<PokemonBody>
    {
        const processed = { ...body };

        processed.speciesId = await speciesService.getIdByName(body.speciesName);

        const team = await teamService.getById(body.teamId);
        if (team == null) return Promise.reject(new Error(`No team found with ID ${body.teamId}.`));

        return processed;
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
}

export default new PokemonService();
