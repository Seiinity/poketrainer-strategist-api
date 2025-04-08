import db from "../db/mysql";
import pokemonService from "./pokemon-service";
import trainerService from "./trainer-service";
import { Service } from "./service";
import { Team, TeamBody, TeamReference } from "../models/team";
import { TeamAdapter } from "../adapters/team-adapter";
import { RowDataPacket } from "mysql2";

class TeamService extends Service<Team, TeamBody>
{
    protected adapter = new TeamAdapter();
    protected tableName = "teams";
    protected idField = "team_id";
    protected searchField = "t.name";

    protected baseSelectQuery =
    `
        SELECT
             t.team_id, t.name,
             tr.trainer_id, tr.name AS trainer_name
        FROM teams t
        LEFT JOIN trainers tr ON t.trainer_id = tr.trainer_id
    `;

    protected async processRequestBody(body: TeamBody): Promise<TeamBody>
    {
        const processed = { ...body };
        processed.trainerId = await trainerService.getIdByName(body.trainerName);
        return processed;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<Team>
    {
        row.pokemon = await pokemonService.getReferencesByTeamId(row.team_id);
        return super.adaptToModel(row);
    }

    async getReferencesByTrainerId(trainerId: number): Promise<TeamReference[]>
    {
        try
        {
            const rows = await db.queryTyped<RowDataPacket>
            (
                `SELECT team_id, name
                FROM teams
                WHERE trainer_id = ?`,
                [trainerId]
            );

            return rows.map(row => this.adapter.referenceFromMySQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching team reference by trainer ID: ${(error as Error).message}`);
        }
    }
}

const teamService = new TeamService();
export default teamService;