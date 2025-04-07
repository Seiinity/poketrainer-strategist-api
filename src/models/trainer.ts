import { TeamReference } from "./team";
import config from "../config";

export type Trainer =
{
    id?: number;
    name: string;
    teams?: TeamReference[];
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