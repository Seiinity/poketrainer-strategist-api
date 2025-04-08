import { RowDataPacket } from "mysql2";
import { Trainer, TrainerBody } from "../models/trainer";
import { Adapter } from "./adapter";

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

    toMySQL(requestBody: TrainerBody): Record<string, any>
    {
        return {
            name: requestBody.name,
            password_hash: requestBody.passwordHash,
        }
    }
}