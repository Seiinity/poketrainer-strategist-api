import config from "../config";
import { TeamReference } from "./team";
import { SpeciesReference } from "./species";
import { Request } from "express";
import { StatReference } from "./stat";

export class Pokemon
{
    id: number;
    nickname?: string;
    species: SpeciesReference;
    stats: StatReference[];
    team: TeamReference;

    constructor(data: {
        id: number;
        nickname?: string;
        species: SpeciesReference;
        stats: StatReference[];
        team: TeamReference;
    })
    {
        this.id = data.id;
        this.nickname = data.nickname;
        this.species = data.species;
        this.stats = data.stats;
        this.team = data.team;
    }
}

export class PokemonReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api${config.pokemonPath}/${id}`;
    }
}

export class PokemonBody
{
    nickname?: string;
    speciesName?: string;
    speciesId?: number;
    teamId?: number;
    evs?: number[];

    constructor(requestBody: Request["body"])
    {
        this.nickname = requestBody.nickname;
        this.speciesName = requestBody.speciesName;
        this.teamId = requestBody.teamId;
        this.evs = requestBody.evs;
    }
}
