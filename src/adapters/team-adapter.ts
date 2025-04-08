import { RowDataPacket } from "mysql2";
import { Team, TeamBody, TeamReference } from "../models/team";
import { TrainerReference } from "../models/trainer";
import { Adapter } from "./adapter";

export class TeamAdapter extends Adapter<Team, TeamBody>
{
    fromMySQL(row: RowDataPacket): Team
    {
        return new Team
        ({
            id: row.team_id,
            name: row.name,
            trainer: new TrainerReference(row.trainer_name, row.trainer_id),
            pokemon: row.pokemon,
        });
    }

    referenceFromMySQL(row: RowDataPacket): TeamReference
    {
        return new TeamReference(row.name, row.id);
    }

    toMySQL(requestBody: TeamBody): Record<string, any>
    {
        return {
            id: requestBody.name,
            trainer_id: requestBody.trainerId,
            name: requestBody.name,
        }
    }
}