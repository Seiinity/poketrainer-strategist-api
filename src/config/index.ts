import dotenv from "dotenv";

dotenv.config();

interface Config
{
    port: number;
    dbName: string;
    dbHost: string;
    dbPort: number;
    dbUser: string;
    dbPass: string;
}

const config: Config =
{
    port: Number(process.env.APP_PORT),
    dbName: String(process.env.DB_NAME),
    dbHost: String(process.env.DB_HOST),
    dbPort: Number(process.env.DB_PORT),
    dbUser: String(process.env.DB_USER),
    dbPass: String(process.env.DB_PASS)
};

export default config;