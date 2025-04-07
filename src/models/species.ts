import { TypeReference } from "./type";

export type Species =
{
    id?: number;
    name: string;
    types: TypeReference[];
}

export type SpeciesBody =
{
    name: string;
    types: string[];
}