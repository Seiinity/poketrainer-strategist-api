import { TrainerReference } from "./trainer";
import { PokemonReference } from "./pokemon";
import config from "../config";

export type Team =
{
    id: number;
    name: string;
    trainer: TrainerReference;
    pokemon: PokemonReference[];
}

export class TeamReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api/teams/${id}`;
    }
}

export type TeamBody =
{
    name: string;
    trainer: string;
}