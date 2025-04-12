import { Adapter } from "./adapter";
import { Move, MoveBody, MoveReference } from "../models/move";
import { RowDataPacket } from "mysql2";
import { TypeReference } from "../models/type";
import { MySQLData } from "../types/mysql-types";

class MoveAdapter extends Adapter<Move, MoveBody>
{
    fromMySQL(row: RowDataPacket): Move
    {
        return new Move
        ({
            id: row.move_id,
            name: row.name,
            description: row.description,
            type: new TypeReference(row.type_name, row.type_id),
            power: Number(row.power),
            accuracy: Number(row.accuracy),
            pp: Number(row.pp),
            generation: row.generation
        });
    }

    toMySQL(requestBody: MoveBody): MySQLData
    {
        return {
            move_id: requestBody.id,
            name: requestBody.name,
            description: requestBody.description,
            type_id: requestBody.typeId,
            power: requestBody.power,
            accuracy: requestBody.accuracy,
            pp: requestBody.pp,
            generation_id: requestBody.generation
        };
    }

    referenceFromMySQL(row: RowDataPacket): MoveReference
    {
        return new MoveReference(row.name, row.move_id);
    }
}

export default new MoveAdapter();
