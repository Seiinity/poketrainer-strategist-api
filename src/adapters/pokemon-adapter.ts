import { Pokemon, PokemonBody, PokemonReference } from "../models/pokemon";
import { SpeciesReference } from "../models/species";
import { TeamReference } from "../models/team";
import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";
import { NatureReference } from "../models/nature";

export class PokemonAdapter extends Adapter<Pokemon, PokemonBody>
{
    fromMySQL(row: RowDataPacket): Pokemon
    {
        return new Pokemon
        ({
            id: row.pokemon_id,
            ...row.nickname != null && { nickname: row.nickname },
            species: new SpeciesReference(row.species_name, row.species_id),
            nature: new NatureReference(row.nature_name, row.nature_id),
            stats: row.stats,
            team: new TeamReference(row.team_name, row.team_id),
        });
    }

    referenceFromMySQL(row: RowDataPacket): PokemonReference
    {
        return new PokemonReference(row.nickname ?? row.species_name, row.id);
    }

    toMySQL(requestBody: PokemonBody): MySQLData
    {
        return {
            species_id: requestBody.speciesId,
            nature_id: requestBody.natureId,
            team_id: requestBody.teamId,
            nickname: requestBody.nickname,
        };
    }
}
