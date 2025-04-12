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

    abilityPath: string;
    movePath: string;
    naturePath: string;
    pokemonPath: string;
    speciesPath: string;
    statPath: string;
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

    abilityPath: "/abilities",
    movePath: "/moves",
    naturePath: "/natures",
    pokemonPath: "/pokemon",
    speciesPath: "/species",
    statPath: "/stats",
    teamPath: "/teams",
    trainerPath: "/trainers",
    typePath: "/types",
};

export default config;
