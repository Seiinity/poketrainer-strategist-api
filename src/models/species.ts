import { TypeReference } from "./type";
import config from "../config";

export class Species
{
    id?: number;
    name: string;
    types: TypeReference[];
    genderRatio: string;

    constructor(data: {
        id?: number;
        name: string;
        types: TypeReference[];
        genderRatio: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.types = data.types;
        this.genderRatio = data.genderRatio;
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

    constructor(requestBody: any)
    {
        this.name = requestBody.name;
        this.typeNames = requestBody.typeNames;
        this.genderRatioId = requestBody.genderRatioId;
    }
}