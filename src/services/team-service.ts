import db from "../db/mysql";
import pokemonService from "./pokemon-service";
import trainerService from "./trainer-service";
import { Service } from "./service";
import { Team, TeamBody } from "../models/team";
import { RowDataPacket } from "mysql2";
import teamAdapter from "../adapters/team-adapter";

class TeamService extends Service<Team, TeamBody>
{
    protected adapter = teamAdapter;
    protected tableName = "teams";
    protected tableAlias = "tm";
    protected idField = "team_id";
    protected searchField = "name";

    protected baseSelectQuery = `
        SELECT
             tm.team_id, tm.name,
             tr.trainer_id, tr.name AS trainer_name
        FROM teams tm
            LEFT JOIN trainers tr ON tm.trainer_id = tr.trainer_id
    `;

    protected override async processRequestBody(body: TeamBody): Promise<TeamBody>
    {
        const processed = { ...body };
        if (body.trainerName)
        {
            processed.trainerId = await trainerService.nameLookup.getIdByName(body.trainerName);
        }
        return processed;
    }

    protected override async adaptToModel(row: RowDataPacket): Promise<Team>
    {
        row.pokemon = await pokemonService.geByTeamId(row.team_id);
        return super.adaptToModel(row);
    }

    async getByTrainerId(trainerId: number): Promise<RowDataPacket[]>
    {
        try
        {
            return await db.queryTyped<RowDataPacket>
            (
                `SELECT team_id, name
                FROM teams
                WHERE trainer_id = ?`,
                [trainerId]
            );
        }
        catch (error)
        {
            throw new Error(`Error fetching team reference by trainer ID: ${(error as Error).message}`);
        }
    }
}

export default new TeamService();
