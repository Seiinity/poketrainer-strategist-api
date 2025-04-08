import { RowDataPacket } from "mysql2";
import { Type } from "../models/type";

export class TypeAdapter
{
    static fromMySql(row: RowDataPacket): Type
    {
        return new Type
        ({
            id: row.id,
            name: row.name,
        });
    }
}