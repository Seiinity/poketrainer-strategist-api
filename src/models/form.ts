import config from "../config";
import { TypeReference } from "./type";
import { AbilityReferenceForSpecies } from "./ability";
import { StatReferenceForSpecies } from "./stat";
import { MoveReference } from "./move";
import { Species, SpeciesBody, SpeciesReference } from "./species";
import { buildReferencePath, getSpriteUrl } from "../utils/helpers";
import { Request } from "express";

export class Form extends Species
{
    constructor(data: {
        id: number;
        name: string;
        types: TypeReference[];
        species: SpeciesReference;
        genderRatio: string;
        height: number;
        weight: number;
        abilities: AbilityReferenceForSpecies[];
        baseStats: StatReferenceForSpecies[];
        learnset: MoveReference[];
        generation: string;
    })
    {
        super(data);
        this.spriteUrl = getSpriteUrl(config.formPath, this.id.toString());
    }
}

export class FormBody extends SpeciesBody
{
    species?: string;
    speciesId?: number;

    constructor(requestBody: Request["body"])
    {
        super(requestBody);
        this.species = requestBody.species;
    }
}

export class FormReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = buildReferencePath(config.formPath, id);
    }
}