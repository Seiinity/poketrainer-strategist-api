import { RowDataPacket } from "mysql2";
import { Type, TypeBody } from "../models/type";
import { TeamBody } from "../models/team";
import { Adapter } from "./adapter";

export class TypeAdapter extends Adapter<Type, TypeBody>
{
    fromMySQL(row: RowDataPacket): Type
    {
        return new Type
        ({
            id: row.type_id,
            name: row.name,
        });
    }

    toMySQL(requestBody: TeamBody): Record<string, any>
    {
        return {
            name: requestBody.name,
        }
    }
}