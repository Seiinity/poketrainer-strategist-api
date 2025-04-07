import db from "../db/mysql";
import { Type } from "../models/type";
import { ResultSetHeader } from "mysql2";
import { isErrorCode } from "../utils/error-handling";

/* CRUD methods. */

async function getAllTypes(): Promise<Type[]>
{
    try
    {
        return await db.queryTyped<Type>("SELECT * FROM types");
    }
    catch (error)
    {
        throw new Error(`Error fetching types: ${(error as Error).message}`);
    }
}

async function getTypeById(id: number): Promise<Type | null>
{
    try
    {
        return await db.queryOne<Type>("SELECT * FROM types WHERE id = ?", [id]);
    }
    catch (error)
    {
        throw new Error(`Error fetching type with ID ${id}: ${(error as Error).message}`);
    }
}

async function createType(newType: Type): Promise<Type>
{
    try
    {
        const sql = "INSERT INTO types (name) VALUES (?)";
        const params = [newType.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            name: newType.name,
        };
    }
    catch (error)
    {
        throw new Error(`Error creating type: ${(error as Error).message}`);
    }
}

async function updateTypeById(id: number, newType: Type): Promise<Type | null>
{
    try
    {
        const sql = "UPDATE types SET name = ? WHERE id = ?";
        const params = [newType.name, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows === 0) return null;

        return {
            id,
            name: newType.name
        };
    }
    catch (error)
    {
        throw new Error(`Error updating type with ID ${id}: ${(error as Error).message}`);
    }
}

async function deleteTypeById(id: number): Promise<boolean>
{
    try
    {
        const [result] = await db.query<ResultSetHeader>("DELETE FROM types WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    catch (error)
    {
        if (isErrorCode(error, "ER_ROW_IS_REFERENCED_2"))
        {
            throw new Error("Cannot delete this type as it is referenced by other records.");
        }

        throw new Error(`Error deleting type by ID: ${(error as Error).message}`);
    }
}

/* Additional methods. */

async function getTypeIdByName(name: string): Promise<number>
{
    try
    {
        const type = await db.queryOne<Type>("SELECT id FROM types WHERE LOWER(name) = LOWER(?)", [name]);
        return (!type || !type.id) ? Promise.reject(new Error(`Unknown type '${name}'`)) : type.id;
    }
    catch (error)
    {
        throw new Error(`Error fetching type ID for ${name}: ${(error as Error).message}`);
    }
}

export default
{
    getAllTypes,
    getTypeById,
    createType,
    updateTypeById,
    deleteTypeById,

    getTypeIdByName
}