import { TeamReference } from "./team";
import { SpeciesReference } from "./species";
import config from "../config";

export type Pokemon =
{
    id: number;
    nickname?: string;
    species: SpeciesReference;
    team: TeamReference;
}

export class PokemonReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api/pokemon/${id}`;
    }
}

export type PokemonBody =
{
    nickname?: string;
    species: string;
    teamId: number;
}