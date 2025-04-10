import { ReadOnlyService } from "./service";
import { Stat } from "../models/stat";
import { StatAdapter } from "../adapters/stat-adapter";

class StatService extends ReadOnlyService<Stat>
{
    protected adapter = new StatAdapter();
    protected tableName = "stats";
    protected tableAlias = "st";
    protected idField = "stat_id";
    protected baseSelectQuery = `SELECT * FROM ${this.tableName} ${this.tableAlias}`;
}

export default new StatService();