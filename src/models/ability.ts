import config from "../config";
import { Request } from "express";
import { SpeciesReference } from "./species";
import { buildReferencePath } from "../utils/helpers";

export class Ability
{
    id: number;
    name: string;
    description: string;
    generation: string;
    species: SpeciesReference[];

    constructor(data: {
        id: number;
        name: string;
        description: string;
        generation: string;
        species: SpeciesReference[];
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.generation = data.generation;
        this.species = data.species;
    }
}

export class AbilityBody
{
    name?: string;
    description?: string;
    generationId?: number;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.description = requestBody.description;
        this.generationId = requestBody.generationId;
    }
}

export class AbilityReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = this.url = buildReferencePath(config.abilityPath, id);
    }
}

export class AbilityReferenceForSpecies
{
    ability:
    {
        name: string;
        url?: string;
    };

    isHidden: boolean;

    constructor(name: string, id: number, isHidden: Buffer)
    {
        this.ability = new AbilityReference(name, id);
        this.isHidden = Boolean(isHidden.readUInt8());
    }
}
