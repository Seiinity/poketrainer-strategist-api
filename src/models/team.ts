﻿import config from "../config";
import { TrainerReference } from "./trainer";
import { PokemonReference } from "./pokemon";
import { Request } from "express";
import { buildReferencePath } from "../utils/helpers";

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

export class TeamBody
{
    name?: string;
    trainerName?: string;
    trainerId?: number;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.trainerName = requestBody.trainerName;
        this.trainerId = requestBody.trainerId;
    }
}

export class TeamReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = this.url = buildReferencePath(config.teamPath, id);
    }
}
