import db from "../db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Team, TeamBody, TeamReference } from "../models/team";
import { isErrorCode } from "../utils/error-handling";
import trainerService from "./trainer-service";
import pokemonService from "./pokemon-service";
import { TeamAdapter } from "../adapters/team-adapter";

/* CRUD methods. */

const baseSelectQuery =
`
    SELECT
        t.id, t.name,
        tr.id AS trainer_id, tr.name AS trainer_name
    FROM teams t
    LEFT JOIN trainers tr ON t.trainer_id = tr.id
`;

async function getAllTeams(): Promise<Team[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>(baseSelectQuery);

        return await Promise.all
        (
            rows.map(async row =>
            {
                row.pokemon = await pokemonService.getPokemonReferencesByTeamId(row.id);
                return TeamAdapter.fromMySql(row);
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
        const row = await db.queryOne<RowDataPacket>(`${baseSelectQuery} WHERE t.id = ?`, [id]);
        if (!row) return null;

        row.pokemon = await pokemonService.getPokemonById(row.id);
        return TeamAdapter.fromMySql(row);
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
        const trainerId = await trainerService.getTrainerIdByName(newTeam.trainerName);

        const sql = "INSERT INTO teams VALUES (NULL, ?, ?)";
        const params = [trainerId, newTeam.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return await getTeamById(result.insertId) as Team;
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
        const trainerId = await trainerService.getTrainerIdByName(newTeam.trainerName);

        const sql = "UPDATE teams SET name = ?, trainer_id = ? WHERE id = ?";
        const params = [newTeam.name, trainerId, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;
        return await getTeamById(id) as Team;
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

/* Additional methods. */

async function getTeamReferencesByTrainerId(trainerId: number): Promise<TeamReference[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>
        (
            `SELECT id, name
            FROM teams
            WHERE trainer_id = ?`,
            [trainerId]
        );

        return rows.map(row => TeamAdapter.referenceFromMySql(row));
    }
    catch (error)
    {
        throw new Error(`Error fetching team reference by trainer ID: ${(error as Error).message}`);
    }
}

export default
{
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById,

    getTeamReferencesByTrainerId
}