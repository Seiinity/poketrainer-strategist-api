import { TypeReference } from "./type";
import config from "../config";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;
    height: number;
    weight: number;

    constructor(data: {
        id?: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
        height: number;
        weight: number;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.types = data.types;
        this.genderRatio = data.genderRatio;
        this.height = data.height;
        this.weight = data.weight;
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

    constructor(requestBody: any)
    {
        this.name = requestBody.name;
        this.typeNames = requestBody.typeNames;
        this.genderRatioId = requestBody.genderRatioId;
        this.height = requestBody.height;
        this.weight = requestBody.weight;
    }
}