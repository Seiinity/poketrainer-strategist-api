﻿import config from "../config";
import { TeamReference } from "./team";
import { SpeciesReference } from "./species";
import { Request } from "express";
import { StatReferenceForPokemon } from "./stat";
import { NatureReference } from "./nature";
import { AbilityReference } from "./ability";
import { MoveReference } from "./move";
import { HeldItemReference } from "./held-item";
import { buildReferencePath } from "../utils/helpers";

export class Pokemon
{
    id: number;
    nickname?: string;
    level: number;
    gender: string;
    species: SpeciesReference;
    ability: AbilityReference;
    nature: NatureReference;
    heldItem?: HeldItemReference;
    moves: MoveReference[];
    stats: StatReferenceForPokemon[];
    team: TeamReference;

    constructor(data: {
        id: number;
        nickname?: string;
        gender: string;
        level: number;
        species: SpeciesReference;
        ability: AbilityReference;
        nature: NatureReference;
        heldItem?: HeldItemReference;
        moves: MoveReference[];
        stats: StatReferenceForPokemon[];
        team: TeamReference;
    })
    {
        this.id = data.id;
        this.nickname = data.nickname;
        this.level = data.level;
        this.gender = data.gender;
        this.species = data.species;
        this.ability = data.ability;
        this.nature = data.nature;
        this.heldItem = data.heldItem;
        this.moves = data.moves;
        this.stats = data.stats;
        this.team = data.team;
    }
}

export class PokemonBody
{
    nickname?: string;
    level?: number;
    gender?: string;
    genderId?: number;
    species?: string;
    speciesId?: number;
    ability?: string;
    abilityId?: number;
    nature?: string;
    natureId?: number;
    heldItem?: string;
    heldItemId?: number;
    evs?: number[];
    ivs?: number[];
    moves?: string[];
    teamId?: number;

    constructor(requestBody: Request["body"])
    {
        this.nickname = requestBody.nickname;
        this.level = requestBody.level;
        this.gender = requestBody.gender;
        this.species = requestBody.species;
        this.ability = requestBody.ability;
        this.nature = requestBody.nature;
        this.heldItem = requestBody.heldItem;
        this.evs = requestBody.evs;
        this.ivs = requestBody.ivs;
        this.moves = requestBody.moves;
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
        this.url = buildReferencePath(config.pokemonPath, id);
    }
}
