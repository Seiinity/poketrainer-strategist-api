import { ReadOnlyAdapter } from "./adapter";
import { Stat, BaseStatReference, PokemonStatReference } from "../models/stat";
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

    pokemonReferenceFromMySQL(row: RowDataPacket): PokemonStatReference
    {
        return new PokemonStatReference(row.name, row.stat_id, row.base_value, row.evs, row.ivs, row.level, row.raised_stat_id, row.lowered_stat_id);
    }
}
