import { NameLookupReadOnlyService } from "./service";
import { Nature } from "../models/nature";
import natureAdapter from "../adapters/nature-adapter";

class NatureService extends NameLookupReadOnlyService<Nature>
{
    protected adapter = natureAdapter;
    protected tableName = "natures";
    protected tableAlias = "nt";
    protected idField = "nature_id";
    protected searchField = "name";
    protected nameField = "name";

    protected baseSelectQuery = `
        SELECT nt.*, rs.name AS raised_stat_name, ls.name AS lowered_stat_name FROM natures nt
        LEFT JOIN stats rs ON nt.raised_stat_id = rs.stat_id
        LEFT JOIN stats ls ON nt.lowered_stat_id = ls.stat_id
    `;
}

export default new NatureService();
