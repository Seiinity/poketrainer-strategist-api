import { RowDataPacket } from "mysql2";
import { Trainer } from "../models/trainer";

export class TrainerAdapter
{
    static fromMySQL(row: RowDataPacket): Trainer
    {
        return new Trainer
        ({
            id: row.id,
            name: row.name,
            passwordHash: row.passwordHash,
            teams: row.teams,
        });
    }
}