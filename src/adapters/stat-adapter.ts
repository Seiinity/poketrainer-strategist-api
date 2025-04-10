import { ReadOnlyAdapter } from "./adapter";
import { Stat } from "../models/stat";
import { RowDataPacket } from "mysql2";

export class StatAdapter extends ReadOnlyAdapter<Stat>
{
    fromMySQL(row: RowDataPacket): Stat
    {
        return new Stat
        ({
            id: row.stat_id,
            name: row.name,
        });
    }
}