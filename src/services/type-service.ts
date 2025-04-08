import db from "../db/mysql";
import { Service } from "./service";
import { Type, TypeBody } from "../models/type";
import { TypeAdapter } from "../adapters/type-adapter";

class TypeService extends Service<Type, TypeBody>
{
    protected adapter = new TypeAdapter();
    protected tableName = "types";
    protected idField = "type_id";
    protected searchField = "name";
    protected baseSelectQuery = "SELECT * FROM types";

    async getIdByName(name: string): Promise<number>
    {
        try
        {
            const type = await db.queryOne<Type>("SELECT type_id AS id FROM types WHERE LOWER(name) = LOWER(?)", [name]);
            return (!type || !type.id) ? Promise.reject(new Error(`Unknown type '${name}'`)) : type.id;
        }
        catch (error)
        {
            throw new Error(`Error fetching type ID for ${name}: ${(error as Error).message}`);
        }
    }
}

const typeService = new TypeService();
export default typeService;
