import { RowDataPacket } from "mysql2";
import { Type, TypeBody } from "../models/type";
import { TeamBody } from "../models/team";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";

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

    toMySQL(requestBody: TeamBody): MySQLData
    {
        return {
            name: requestBody.name,
        };
    }
}
