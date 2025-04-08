export type MySQLQuery =
{
    sql: string;
    params: any[];
}

export function createInsertQuery(tableName: string, data: Record<string, any>): MySQLQuery
{
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?');
    const params = Object.values(data);

    return {
        sql: `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
        params
    };
}

export function createUpdateQuery(tableName: string, filter: string, data: Record<string, any>): MySQLQuery
{
    const entries = Object.entries(data).filter(([_, value]) => value !== undefined);

    const setClauses = entries.map(([key]) => `${key} = ?`);
    const params = entries.map(([_, value]) => value);

    return {
        sql: `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${filter} = ?`,
        params
    };
}