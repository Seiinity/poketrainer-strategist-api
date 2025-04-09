import config from "../config";
import { TypeReference } from "./type";
import { Request } from "express";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;
    height: number;
    weight: number;
    generation: string;

    constructor(data: {
        id?: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
        height: number;
        weight: number;
        generation: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.types = data.types;
        this.genderRatio = data.genderRatio;
        this.height = data.height;
        this.weight = data.weight;
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
        this.url = `${config.baseUrl}/api/species/${id}`;
    }
}

export class SpeciesBody
{
    name: string;
    typeNames: string[];
    genderRatioId: number;
    height: number;
    weight: number;
    type1Id?: number;
    type2Id?: number | null;
    generationId: number;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.typeNames = requestBody.typeNames;
        this.genderRatioId = requestBody.genderRatioId;
        this.height = requestBody.height;
        this.weight = requestBody.weight;
        this.generationId = requestBody.generationId;
    }
}
