import mysql from "mysql2/promise";
import config from "../config";

const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName
});

export default pool;