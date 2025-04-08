import { TrainerReference } from "./trainer";
import { PokemonReference } from "./pokemon";
import config from "../config";

export class Team
{
    id: number;
    name: string;
    trainer: TrainerReference;
    pokemon: PokemonReference[];

    constructor(data: {
        id: number;
        name: string;
        trainer: TrainerReference;
        pokemon: PokemonReference[];
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.trainer = data.trainer;
        this.pokemon = data.pokemon;
    }
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

export class TeamBody
{
    name: string;
    trainerName: string;
    trainerId?: number;

    constructor(requestBody: any)
    {
        this.name = requestBody.name;
        this.trainerName = requestBody.trainerName;
        this.trainerId = requestBody.trainerId;
    }
}