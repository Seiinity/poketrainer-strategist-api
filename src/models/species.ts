import config from "../config";
import { TypeReference } from "./type";
import { Request } from "express";
import { SpeciesAbilityReference } from "./ability";
import { BaseStatReference } from "./stat";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;
    height: number;
    weight: number;
    abilities: SpeciesAbilityReference[];
    baseStats: BaseStatReference[];
    generation: string;

    constructor(data: {
        id?: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
        height: number;
        weight: number;
        abilities: SpeciesAbilityReference[];
        baseStats: BaseStatReference[];
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
        this.baseStats = data.baseStats;
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
        this.url = `${config.baseUrl}/api${config.speciesPath}/${id}`;
    }
}

export class SpeciesBody
{
    id?: number;
    name?: string;
    types?: string[];
    genderRatioId?: number;
    height?: number;
    weight?: number;
    type1Id?: number;
    type2Id?: number;
    abilities?: string[];
    hiddenAbility?: string;
    baseStats?: number[];
    generationId?: number;

    constructor(requestBody: Request["body"])
    {
        this.id = requestBody.id;
        this.name = requestBody.name;
        this.types = requestBody.types;
        this.genderRatioId = requestBody.genderRatioId;
        this.height = requestBody.height;
        this.weight = requestBody.weight;
        this.abilities = requestBody.abilities;
        this.hiddenAbility = requestBody.hiddenAbility;
        this.baseStats = requestBody.baseStats;
        this.generationId = requestBody.generationId;
    }
}
