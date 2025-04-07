import { TeamReference } from "./team";
import config from "../config";

export type Trainer =
{
    id?: number;
    name: string;
    passwordHash?: string;
    teams?: TeamReference[];
}

export type TrainerBody =
{
    name: string;
    password: string;
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