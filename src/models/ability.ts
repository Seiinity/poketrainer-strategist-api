import { Request } from "express";

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
