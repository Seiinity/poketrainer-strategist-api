import config from "../config";
import { TeamReference } from "./team";
import { SpeciesReference } from "./species";
import { Request } from "express";
import { StatReferenceForPokemon } from "./stat";
import { NatureReference } from "./nature";

export class Pokemon
{
    id: number;
    nickname?: string;
    species: SpeciesReference;
    nature: NatureReference;
    stats: StatReferenceForPokemon[];
    team: TeamReference;

    constructor(data: {
        id: number;
        nickname?: string;
        species: SpeciesReference;
        nature: NatureReference;
        stats: StatReferenceForPokemon[];
        team: TeamReference;
    })
    {
        this.id = data.id;
        this.nickname = data.nickname;
        this.species = data.species;
        this.nature = data.nature;
        this.stats = data.stats;
        this.team = data.team;
    }
}

export class PokemonBody
{
    nickname?: string;
    species?: string;
    speciesId?: number;
    nature?: string;
    natureId?: number;
    evs?: number[];
    ivs?: number[];
    teamId?: number;

    constructor(requestBody: Request["body"])
    {
        this.nickname = requestBody.nickname;
        this.species = requestBody.species;
        this.nature = requestBody.nature;
        this.evs = requestBody.evs;
        this.ivs = requestBody.ivs;
        this.teamId = requestBody.teamId;
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
