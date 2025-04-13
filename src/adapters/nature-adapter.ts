import { ReadOnlyAdapter } from "./adapter";
import { Nature } from "../models/nature";
import { RowDataPacket } from "mysql2";
import { StatReference } from "../models/stat";

class NatureAdapter extends ReadOnlyAdapter<Nature>
{
    fromMySQL(row: RowDataPacket): Nature
    {
        return new Nature
        ({
            id: row.stat_id,
            name: row.name,
            raisedStat: row.raised_stat_id ? new StatReference(row.raised_stat_name, row.raised_stat_id) : null,
            loweredStat: row.lowered_stat_id ? new StatReference(row.lowered_stat_name, row.lowered_stat_id) : null,
        });
    }
}

export default new NatureAdapter();
