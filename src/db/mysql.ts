import mysql from "mysql2/promise";
import config from "../config";

const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName
});

// "Extension" method to perform a SQL query and get typed result.
async function queryTyped<T>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
}

// "Extension" method to fetch only one element.
async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
    const [rows] = await pool.query(sql, params);
    return (rows as T[])[0] || null;
}


export default {
    pool,
    query: pool.query.bind(pool),
    queryTyped,
    queryOne
};