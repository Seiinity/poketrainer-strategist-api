import { TypeReference } from "./type";
import config from "../config";

export type Species =
{
    id?: number;
    name: string;
    types: TypeReference[];
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

export type SpeciesBody =
{
    name: string;
    types: string[];
}