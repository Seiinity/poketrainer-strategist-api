import { RowDataPacket } from "mysql2";
import { Team } from "../models/team";
import { TrainerReference } from "../models/trainer";

export class TeamAdapter
{
    static fromMySql(row: RowDataPacket): Team
    {
        return new Team
        ({
            id: row.id,
            name: row.name,
            trainer: new TrainerReference(row.trainer_name, row.trainer_id),
            pokemon: row.pokemon,
        });
    }
}