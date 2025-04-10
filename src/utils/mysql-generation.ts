import { MySQLData, MySQLQuery } from "../types/mysql-types";
import { PoolConnection } from "mysql2/promise";

export function createInsertQuery(tableName: string, data: MySQLData): MySQLQuery
{
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?");
    const params = Object.values(data);

    return {
        sql: `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
        params,
    };
}

export function createUpdateQuery(tableName: string, filter: string, data: MySQLData): MySQLQuery | null
{
    const entries = Object.entries(data).filter(([key, value]) =>
        Object.prototype.hasOwnProperty.call(data, key) && value !== undefined
    );

    if (entries.length == 0)
    {
        return null;
    }

    const setClauses = entries.map(([key]) => `${key} = ?`);
    const params = entries.map(([_, value]) => value);

    return {
        sql: `UPDATE ${tableName} SET ${setClauses.join(", ")} WHERE ${filter} = ?`,
        params,
    };
}

export async function getLastInsertId(connection: PoolConnection): Promise<number>
{
    const [rows] = await connection.query("SELECT LAST_INSERT_ID() AS insertId");
    return (rows as { insertId: number }[])[0].insertId;
}
