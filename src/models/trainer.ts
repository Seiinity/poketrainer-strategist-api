import config from "../config";
import { TeamReference } from "./team";

export class Trainer
{
    id?: number;
    name: string;
    passwordHash?: string;
    teams?: TeamReference[];

    constructor(data: {
        id?: number;
        name: string;
        passwordHash?: string;
        teams?: TeamReference[];
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.passwordHash = data.passwordHash;
        this.teams = data.teams;
    }
}

export class TrainerReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api/trainers/${id}`;
    }
}

export class TrainerBody
{
    name: string;
    password?: string;
    passwordHash?: string;

    constructor(requestBody: any, passwordHash?: string)
    {
        this.name = requestBody.name;
        this.password = requestBody.password;
        this.passwordHash = passwordHash;
    }
}