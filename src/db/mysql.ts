import config from "../config";
import mysql, { PoolConnection } from "mysql2/promise";
import { MySQLCompatibleValue } from "../types/mysql-types";

const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
});

// "Extension" method to perform a SQL query and get typed result.
async function queryTyped<T>(sql: string, params: MySQLCompatibleValue[] = []): Promise<T[]>
{
    const [rows] = await pool.query(sql, params);
    return rows as T[];
}

// "Extension" method to fetch only one element.
async function queryOne<T>(sql: string, params?: MySQLCompatibleValue[]): Promise<T | null>
{
    const [rows] = await pool.query(sql, params);
    return (rows as T[])[0] || null;
}


export default {
    pool,
    query: pool.query.bind(pool),
    queryTyped,
    queryOne,
    getConnection: (): Promise<PoolConnection> => pool.getConnection(),
};
