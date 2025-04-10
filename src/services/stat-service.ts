import db from "../db/mysql";
import { ReadOnlyService } from "./service";
import { Stat, StatReference } from "../models/stat";
import { StatAdapter } from "../adapters/stat-adapter";
import { RowDataPacket } from "mysql2";

class StatService extends ReadOnlyService<Stat>
{
    protected adapter = new StatAdapter();
    protected tableName = "stats";
    protected tableAlias = "st";
    protected idField = "stat_id";
    protected baseSelectQuery = `SELECT * FROM ${this.tableName} ${this.tableAlias}`;

    async getReferencesBySpeciesId(speciesId: number): Promise<StatReference[]>
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
            return rows.map(row => this.adapter.referenceFromMySQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching stat reference by species ID: ${(error as Error).message}`);
        }
    }
}

export default new StatService();
