import { RowDataPacket } from "mysql2";
import { Trainer, TrainerBody } from "../models/trainer";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";

export class TrainerAdapter extends Adapter<Trainer, TrainerBody>
{
    fromMySQL(row: RowDataPacket): Trainer
    {
        return new Trainer
        ({
            id: row.trainer_id,
            name: row.name,
            passwordHash: row.password_hash,
            teams: row.teams,
        });
    }

    toMySQL(requestBody: TrainerBody): MySQLData
    {
        return {
            name: requestBody.name,
            password_hash: requestBody.passwordHash,
        };
    }
}
