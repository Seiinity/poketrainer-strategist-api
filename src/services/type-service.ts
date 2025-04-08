import db from "../db/mysql";
import { Type, TypeBody } from "../models/type";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { isErrorCode } from "../utils/error-handling";
import { TypeAdapter } from "../adapters/type-adapter";

/* CRUD methods. */

const baseSelectQuery = "SELECT * FROM types";

async function getAllTypes(): Promise<Type[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>(baseSelectQuery);
        return rows.map(row => TypeAdapter.fromMySql(row));
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
        const row = await db.queryOne<RowDataPacket>(`${baseSelectQuery} WHERE id = ?`, [id]);
        return row ? TypeAdapter.fromMySql(row) : null;
    }
    catch (error)
    {
        throw new Error(`Error fetching type with ID ${id}: ${(error as Error).message}`);
    }
}

async function createType(newType: TypeBody): Promise<Type>
{
    try
    {
        const sql = "INSERT INTO types (name) VALUES (?)";
        const params = [newType.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return await getTypeById(result.insertId) as Type;
    }
    catch (error)
    {
        throw new Error(`Error creating type: ${(error as Error).message}`);
    }
}

async function updateTypeById(id: number, newType: TypeBody): Promise<Type | null>
{
    try
    {
        const sql = "UPDATE types SET name = ? WHERE id = ?";
        const params = [newType.name, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows === 0) return null;
        return await getTypeById(id) as Type;
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