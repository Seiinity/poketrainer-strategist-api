import db from "../db/mysql";
import { Type } from "../models/type";

async function getTypeIdByName(name: string): Promise<number | null>
{
    try
    {
        const type = await db.queryOne<Type>("SELECT id FROM types WHERE LOWER(name) = LOWER(?)", [name]);
        return type != null && type.id ? type.id : null;

    }
    catch (error)
    {
        console.error(`Error fetching type ID for ${name}: ${error}`);
        throw new Error("Could not fetch type ID.");
    }
}