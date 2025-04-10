import { MySQLData, MySQLQuery } from "../types/mysql-types";

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
