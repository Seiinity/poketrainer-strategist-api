import { Pokemon, PokemonReference } from "../models/pokemon";
import { SpeciesReference } from "../models/species";
import { TeamReference } from "../models/team";
import { RowDataPacket } from "mysql2";

export class PokemonAdapter
{
    static fromMySQL(row: RowDataPacket): Pokemon
    {
        return new Pokemon
        ({
            id: row.id,
            ...(row.nickname != null && { nickname: row.nickname }),
            species: new SpeciesReference(row.species_name, row.species_id),
            team: new TeamReference(row.team_name, row.team_id)
        });
    }

    static referenceFromMySQL(row: RowDataPacket): PokemonReference
    {
        return new PokemonReference(row.nickname ?? row.species_name, row.id);
    }
}