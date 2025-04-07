import db from "../db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TeamReference } from "../models/team";
import { Pokemon, PokemonBody, PokemonReference } from "../models/pokemon";
import { SpeciesReference } from "../models/species";
import speciesService from "./species-service";
import teamService from "./team-service";

/* CRUD methods. */

async function getAllPokemon(): Promise<Pokemon[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>
        (
            `SELECT 
                p.id, p.nickname, 
                s.id AS species_id, s.name AS species_name,
                t.id AS team_id, t.name AS team_name
            FROM pokemon p
            LEFT JOIN species s ON p.species_id = s.id
            LEFT JOIN teams t ON p.team_id = t.id`
        );

        return rows.map(row =>
        ({
            id: row.id,
            ...(row.nickname != null && { nickname: row.nickname }),
            species: new SpeciesReference(row.species_name, row.species_id),
            team: new TeamReference(row.team_name, row.team_id)
        }));
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
        const pokemon = await db.queryOne<RowDataPacket>
        (
            `SELECT 
                p.id, p.nickname, 
                s.id AS species_id, s.name AS species_name,
                t.id AS team_id, t.name AS team_name
            FROM pokemon p
            LEFT JOIN species s ON p.species_id = s.id
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.id = ?`,
            [id]
        );

        if (!pokemon) return null;

        return {
            id: pokemon.id,
            ...(pokemon.nickname != null && { nickname: pokemon.nickname }),
            species: new SpeciesReference(pokemon.species_name, pokemon.species_id),
            team: new TeamReference(pokemon.team_name, pokemon.team_id)
        }
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
        const speciesId = await speciesService.getSpeciesIdByName(newPokemon.species);

        const team = await teamService.getTeamById(newPokemon.teamId);
        if (team == null) return Promise.reject(new Error(`No team found with ID ${newPokemon.teamId}.`));

        const sql = "INSERT INTO pokemon VALUES (NULL, ?, ?, ?)";
        const params = [speciesId, newPokemon.teamId, newPokemon.nickname];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            ...(newPokemon.nickname != null && { nickname: newPokemon.nickname }),
            species: new SpeciesReference(newPokemon.species, speciesId),
            team: new TeamReference(team.name, newPokemon.teamId)
        };
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
        const speciesId = await speciesService.getSpeciesIdByName(newPokemon.species);

        const team = await teamService.getTeamById(newPokemon.teamId);
        if (team == null) return Promise.reject(new Error(`No team found with ID ${newPokemon.teamId}.`));

        const sql = "UPDATE pokemon SET nickname = ?, species_id = ?, team_id = ? WHERE id = ?";
        const params = [newPokemon.nickname, speciesId, newPokemon.teamId, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;

        return {
            id,
            ...(newPokemon.nickname != null && { nickname: newPokemon.nickname }),
            species: new SpeciesReference(newPokemon.species, speciesId),
            team: new TeamReference(team.name, newPokemon.teamId)
        };
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
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.team_id = ?`,
            [teamId]
        );

        return rows.map(row => new PokemonReference(row.nickname ?? row.species_name, row.id));
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