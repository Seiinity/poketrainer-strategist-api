import config from "../config";
import { Request } from "express";
import { getSpriteUrl } from "../utils/helpers";

export class Type
{
    id: number;
    name: string;
    effectiveness: TypeEffectiveness;
    spriteUrl: string;

    constructor(data: {
        id: number;
        name: string;
        effectiveness: TypeEffectiveness;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.effectiveness = data.effectiveness;
        this.spriteUrl = getSpriteUrl(config.typePath, this.id.toString());
    }
}

export class TypeEffectiveness
{
    weakTo: TypeReference[] = [];
    resistantTo: TypeReference[] = [];
    immuneTo: TypeReference[] = [];
    weakAgainst: TypeReference[] = [];
    strongAgainst: TypeReference[] = [];
    ineffectiveAgainst: TypeReference[] = [];
}

export class TypeBody
{
    name?: string;
    weakTo?: string[];
    resistantTo?: string[];
    immuneTo?: string[];
    weakAgainst?: string[];
    strongAgainst?: string[];
    ineffectiveAgainst?: string[];

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.weakTo = requestBody.weakTo;
        this.resistantTo = requestBody.resistantTo;
        this.immuneTo = requestBody.immuneTo;
        this.weakAgainst = requestBody.weakAgainst;
        this.strongAgainst = requestBody.strongAgainst;
        this.ineffectiveAgainst = requestBody.ineffectiveAgainst;
    }
}

export class TypeReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api${config.typePath}/${id}`;
    }
}
