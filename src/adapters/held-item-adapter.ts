import { Adapter } from "./adapter";
import { HeldItem, HeldItemBody } from "../models/held-item";
import { RowDataPacket } from "mysql2";
import { MySQLData } from "../types/mysql-types";

class HeldItemAdapter extends Adapter<HeldItem, HeldItemBody>
{
    fromMySQL(row: RowDataPacket): HeldItem
    {
        return new HeldItem
        ({
            id: row.ability_id,
            name: row.name,
            description: row.description,
        });
    }

    toMySQL(requestBody: HeldItemBody): MySQLData
    {
        return {
            name: requestBody.name,
            description: requestBody.description,
        };
    }
}

export default new HeldItemAdapter();
