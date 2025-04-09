import { Request } from "express";
import config from "../config";

export class Ability
{
    id: number;
    name: string;
    description: string;
    generation: string;

    constructor(data: {
        id: number;
        name: string;
        description: string;
        generation: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.generation = data.generation;
    }
}

export class SpeciesAbilityReference
{
    ability:
    {
        name: string;
        url?: string;
    }
    isHidden: boolean;

    constructor(name: string, id: number, isHidden: Buffer)
    {
        this.ability =
        {
            name: name,
            url: `${config.baseUrl}/api/${config.abilityPath}/${id}`
        }
        this.isHidden = Boolean(isHidden.readUInt8());
    }
}

export class AbilityBody
{
    name: string;
    description: string;
    generationId: number;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.description = requestBody.description;
        this.generationId = requestBody.generationId;
    }
}
