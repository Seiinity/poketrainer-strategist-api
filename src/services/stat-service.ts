import db from "../db/mysql";
import { ReadOnlyService } from "./service";
import { Stat, BaseStatReference, StatReference } from "../models/stat";
import { StatAdapter } from "../adapters/stat-adapter";
import { RowDataPacket } from "mysql2";

class StatService extends ReadOnlyService<Stat>
{
    protected adapter = new StatAdapter();
    protected tableName = "stats";
    protected tableAlias = "st";
    protected idField = "stat_id";
    protected searchField = "name";
    protected baseSelectQuery = `SELECT * FROM ${this.tableName} ${this.tableAlias}`;

    async getReferencesBySpeciesId(speciesId: number): Promise<BaseStatReference[]>
    {
        try
        {
            const query = `
                SELECT 
                    ss.value, st.stat_id, st.name
                FROM species_base_stats ss
                JOIN species sp ON ss.species_id = sp.species_id
                JOIN stats st ON ss.stat_id = st.stat_id
                WHERE ss.species_id = ?
            `;

            const rows = await db.queryTyped<RowDataPacket>(query, [speciesId]);
            return rows.map(row => this.adapter.baseReferenceFromMySQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching stat reference by species ID: ${(error as Error).message}`);
        }
    }

    async getReferencesByPokemonId(pokemonId: number): Promise<StatReference[]>
    {
        try
        {
            const query = `
                SELECT 
                    pe.evs, pi.ivs, pk.level, st.stat_id, st.name, ss.value as base_value
                FROM pokemon_evs pe
                JOIN pokemon_ivs pi ON pe.stat_id = pi.stat_id AND pe.pokemon_id = pi.pokemon_id
                JOIN pokemon pk ON pe.pokemon_id = pk.pokemon_id
                JOIN stats st ON pe.stat_id = st.stat_id
                JOIN species sp ON pk.species_id = sp.species_id
                JOIN species_base_stats ss ON sp.species_id = ss.species_id AND pe.stat_id = ss.stat_id
                WHERE pe.pokemon_id = ?
            `;

            const rows = await db.queryTyped<RowDataPacket>(query, [pokemonId]);
            return rows.map(row => this.adapter.referenceFromMySQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching stat reference by Pokémon ID: ${(error as Error).message}`);
        }
    }
}

export default new StatService();
