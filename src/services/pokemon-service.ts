import db from "../db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Pokemon, PokemonBody, PokemonReference } from "../models/pokemon";
import speciesService from "./species-service";
import teamService from "./team-service";
import { PokemonAdapter } from "../adapters/pokemon-adapter";

/* CRUD methods. */

const baseSelectQuery =
`
    SELECT
        p.id, p.nickname,
        s.id AS species_id, s.name AS species_name,
        t.id AS team_id, t.name AS team_name
    FROM pokemon p
    LEFT JOIN species s ON p.species_id = s.id
    LEFT JOIN teams t ON p.team_id = t.id
`;

async function getAllPokemon(): Promise<Pokemon[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>(baseSelectQuery);
        return rows.map(row => PokemonAdapter.fromMySQL(row));
    }
    catch (error)
    {
        throw new Error(`Error fetching Pokémon: ${(error as Error).message}`);
    }
}

async function getPokemonById(id: number): Promise<Pokemon | null>
{
    try
    {
        const row = await db.queryOne<RowDataPacket> (`${baseSelectQuery} WHERE p.id = ?`, [id]);
        return row ? PokemonAdapter.fromMySQL(row) : null;
    }
    catch (error)
    {
        throw new Error(`Error fetching Pokémon with ID ${id}: ${(error as Error).message}`);
    }
}

async function createPokemon(newPokemon: PokemonBody): Promise<Pokemon>
{
    try
    {
        const speciesId = await speciesService.getSpeciesIdByName(newPokemon.speciesName);

        const team = await teamService.getTeamById(newPokemon.teamId);
        if (team == null) return Promise.reject(new Error(`No team found with ID ${newPokemon.teamId}.`));

        const sql = "INSERT INTO pokemon VALUES (NULL, ?, ?, ?)";
        const params = [speciesId, newPokemon.teamId, newPokemon.nickname];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return await getPokemonById(result.insertId) as Pokemon;
    }
    catch (error)
    {
        throw new Error(`Error creating Pokémon: ${(error as Error).message}`);
    }
}

async function updatePokemonById(id: number, newPokemon: PokemonBody): Promise<Pokemon | null>
{
    try
    {
        const speciesId = await speciesService.getSpeciesIdByName(newPokemon.speciesName);

        const team = await teamService.getTeamById(newPokemon.teamId);
        if (team == null) return Promise.reject(new Error(`No team found with ID ${newPokemon.teamId}.`));

        const sql = "UPDATE pokemon SET nickname = ?, species_id = ?, team_id = ? WHERE id = ?";
        const params = [newPokemon.nickname, speciesId, newPokemon.teamId, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;
        return await getPokemonById(id) as Pokemon;
    }
    catch (error)
    {
        throw new Error(`Error updating Pokémon with ID ${id}: ${(error as Error).message}`);
    }
}

async function deletePokemonById(id: number): Promise<boolean>
{
    try
    {
        const [result] = await db.query<ResultSetHeader>("DELETE FROM pokemon WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    catch (error)
    {
        throw new Error(`Error deleting Pokémon by ID: ${(error as Error).message}`);
    }
}

/* Additional methods. */

async function getPokemonReferencesByTeamId(teamId: number): Promise<PokemonReference[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>
        (
            `SELECT 
                p.id, p.nickname, 
                s.name AS species_name
            FROM pokemon p
            LEFT JOIN species s ON p.species_id = s.id
            WHERE p.team_id = ?`,
            [teamId]
        );

        return rows.map(row => PokemonAdapter.referenceFromMySQL(row));
    }
    catch (error)
    {
        throw new Error(`Error fetching Pokémon reference by team ID: ${(error as Error).message}`);
    }
}


export default
{
    getAllPokemon,
    getPokemonById,
    createPokemon,
    updatePokemonById,
    deletePokemonById,

    getPokemonReferencesByTeamId
}