import { ReadOnlyAdapter } from "./adapter";
import { Stat, StatReferenceForSpecies, StatReferenceForPokemon } from "../models/stat";
import { RowDataPacket } from "mysql2";

class StatAdapter extends ReadOnlyAdapter<Stat>
{
    fromMySQL(row: RowDataPacket): Stat
    {
        return new Stat
        ({
            id: row.stat_id,
            name: row.name,
        });
    }

    referenceForSpeciesFromMySQL(row: RowDataPacket): StatReferenceForSpecies
    {
        return new StatReferenceForSpecies(row.name, row.stat_id, row.value);
    }

    referenceForPokemonFromMySQL(row: RowDataPacket): StatReferenceForPokemon
    {
        return new StatReferenceForPokemon(row.name, row.stat_id, row.base_value, row.evs, row.ivs, row.level, row.raised_stat_id, row.lowered_stat_id);
    }
}

export default new StatAdapter();
