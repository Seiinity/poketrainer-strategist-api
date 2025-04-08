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
    const setClauses = Object.keys(data).map(key => `${key} = ?`);
    const params = Object.values(data);

    return {
        sql: `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${filter} = ?`,
        params
    };
}