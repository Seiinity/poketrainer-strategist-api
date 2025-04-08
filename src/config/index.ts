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
    baseUrl: string;

    pokemonPath: string;
    speciesPath: string;
    teamPath: string;
    trainerPath: string;
    typePath: string;
}

const config: Config =
{
    port: Number(process.env.APP_PORT),
    dbName: String(process.env.DB_NAME),
    dbHost: String(process.env.DB_HOST),
    dbPort: Number(process.env.DB_PORT),
    dbUser: String(process.env.DB_USER),
    dbPass: String(process.env.DB_PASS),
    baseUrl: `${process.env.BASE_URL}:${process.env.APP_PORT}`,

    pokemonPath: "/pokemon",
    speciesPath: "/species",
    teamPath: "/teams",
    trainerPath: "/trainers",
    typePath: "/types"
};

export default config;