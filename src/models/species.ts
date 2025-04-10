import config from "../config";
import { TypeReference } from "./type";
import { Request } from "express";
import { SpeciesAbilityReference } from "./ability";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;
    height: number;
    weight: number;
    abilities: SpeciesAbilityReference[];
    generation: string;

    constructor(data: {
        id?: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
        height: number;
        weight: number;
        abilities: SpeciesAbilityReference[];
        generation: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.types = data.types;
        this.genderRatio = data.genderRatio;
        this.height = data.height;
        this.weight = data.weight;
        this.abilities = data.abilities;
        this.generation = data.generation;
    }
}

export class SpeciesReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api/${config.speciesPath}/${id}`;
    }
}

export class SpeciesBody
{
    id?: number;
    name?: string;
    typeNames?: string[];
    genderRatioId?: number;
    height?: number;
    weight?: number;
    type1Id?: number;
    type2Id?: number;
    abilityNames?: string[];
    hiddenAbilityName?: string;
    generationId?: number;

    constructor(requestBody: Request["body"])
    {
        if (requestBody.id) this.id = requestBody.id;
        if (requestBody.name) this.name = requestBody.name;
        if (requestBody.typeNames) this.typeNames = requestBody.typeNames;
        if (requestBody.genderRatioId) this.genderRatioId = requestBody.genderRatioId;
        if (requestBody.height) this.height = requestBody.height;
        if (requestBody.weight) this.weight = requestBody.weight;
        if (requestBody.abilityNames) this.abilityNames = requestBody.abilityNames;
        if (requestBody.hiddenAbilityName) this.hiddenAbilityName = requestBody.hiddenAbilityName;
        if (requestBody.generationId) this.generationId = requestBody.generationId;
    }
}
