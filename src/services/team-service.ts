import db from "../db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Team, TeamBody } from "../models/team";
import { TrainerReference } from "../models/trainer";
import { isErrorCode } from "../utils/error-handling";
import trainerService from "./trainer-service";
import pokemonService from "./pokemon-service";
import { PokemonReference } from "../models/pokemon";

/* CRUD methods. */

async function getAllTeams(): Promise<Team[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>
        (
            `SELECT 
                t.id, t.name, 
                tr.id AS trainer_id, tr.name AS trainer_name
            FROM teams t
            LEFT JOIN trainers tr ON t.trainer_id = tr.id`
        );

        return await Promise.all
        (
            rows.map(async row =>
            {
                return {
                    id: row.id,
                    name: row.name,
                    trainer: new TrainerReference(row.trainer_name, row.trainer_id),
                    pokemon: await pokemonService.getPokemonReferencesByTeamId(row.id)
                };
            })
        );
    }
    catch (error)
    {
        throw new Error(`Error fetching teams: ${(error as Error).message}`);
    }
}

async function getTeamById(id: number): Promise<Team | null>
{
    try
    {
        const team = await db.queryOne<RowDataPacket>
        (
            `SELECT 
                t.id, t.name, 
                tr.id AS trainer_id, tr.name AS trainer_name
            FROM teams t
            LEFT JOIN trainers tr ON t.trainer_id = tr.id
            WHERE t.id = ?`,
            [id]
        );

        if (!team) return null;

        return {
            id: team.id,
            name: team.name,
            trainer: new TrainerReference(team.trainer_name, team.trainer_id),
            pokemon: await pokemonService.getPokemonReferencesByTeamId(team.id)
        }
    }
    catch (error)
    {
        throw new Error(`Error fetching team with ID ${id}: ${(error as Error).message}`);
    }
}

async function createTeam(newTeam: TeamBody): Promise<Team>
{
    try
    {
        const trainerId = await trainerService.getTrainerIdByName(newTeam.trainer);

        const sql = "INSERT INTO teams VALUES (NULL, ?, ?)";
        const params = [trainerId, newTeam.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            name: newTeam.name,
            trainer: new TrainerReference(newTeam.trainer, trainerId),
            pokemon: await pokemonService.getPokemonReferencesByTeamId(result.insertId)
        };
    }
    catch (error)
    {
        throw new Error(`Error creating team: ${(error as Error).message}`);
    }
}

async function updateTeamById(id: number, newTeam: TeamBody): Promise<Team | null>
{
    try
    {
        const trainerId = await trainerService.getTrainerIdByName(newTeam.trainer);

        const sql = "UPDATE teams SET name = ?, trainer_id = ? WHERE id = ?";
        const params = [newTeam.name, trainerId, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;

        return {
            id,
            name: newTeam.name,
            trainer: new TrainerReference(newTeam.trainer, trainerId),
            pokemon: await pokemonService.getPokemonReferencesByTeamId(id)
        };
    }
    catch (error)
    {
        throw new Error(`Error updating team with ID ${id}: ${(error as Error).message}`);
    }
}

async function deleteTeamById(id: number): Promise<boolean>
{
    try
    {
        const [result] = await db.query<ResultSetHeader>("DELETE FROM teams WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    catch (error)
    {
        if (isErrorCode(error, "ER_ROW_IS_REFERENCED_2"))
        {
            throw new Error("Cannot delete this team as it is referenced by other records.");
        }

        throw new Error(`Error deleting team by ID: ${(error as Error).message}`);
    }
}

export default
{
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById
}