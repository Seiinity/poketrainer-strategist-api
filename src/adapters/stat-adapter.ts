import { ReadOnlyAdapter } from "./adapter";
import { Stat, BaseStatReference, StatReference } from "../models/stat";
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

    baseReferenceFromMySQL(row: RowDataPacket): BaseStatReference
    {
        return new BaseStatReference(row.name, row.stat_id, row.value);
    }

    referenceFromMySQL(row: RowDataPacket): StatReference
    {
        return new StatReference(row.name, row.stat_id, row.base_value, row.evs, row.level);
    }
}
