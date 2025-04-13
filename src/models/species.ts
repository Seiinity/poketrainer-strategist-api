import config from "../config";
import { TypeReference } from "./type";
import { Request } from "express";
import { AbilityReferenceForSpecies } from "./ability";
import { StatReferenceForSpecies } from "./stat";
import { MoveReference } from "./move";
import { buildReferencePath, getSpriteUrl } from "../utils/helpers";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;
    height: number;
    weight: number;
    abilities: AbilityReferenceForSpecies[];
    baseStats: StatReferenceForSpecies[];
    learnset: MoveReference[];
    generation: string;
    spriteUrl: string;

    constructor(data: {
        id: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
        height: number;
        weight: number;
        abilities: AbilityReferenceForSpecies[];
        baseStats: StatReferenceForSpecies[];
        learnset: MoveReference[];
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
        this.learnset = data.learnset;
        this.generation = data.generation;
        this.spriteUrl = getSpriteUrl(config.speciesPath, this.id.toString());
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
    learnset?: string[];
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
        this.learnset = requestBody.learnset;
        this.generationId = requestBody.generationId;
    }
}

export class SpeciesReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = buildReferencePath(config.speciesPath, id);
    }
}

export class SpeciesReferenceForAbility
{
    species: SpeciesReference;
    isHidden: boolean;

    constructor(name: string, id: number, isHidden: Buffer)
    {
        this.species = new SpeciesReference(name, id);
        this.isHidden = Boolean(isHidden.readUInt8());
    }
}
