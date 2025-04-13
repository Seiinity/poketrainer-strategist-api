import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";
import { Ability, AbilityBody, AbilityReferenceForSpecies } from "../models/ability";
import speciesAdapter from "./species-adapter";

class AbilityAdapter extends Adapter<Ability, AbilityBody>
{
    fromMySQL(row: RowDataPacket): Ability
    {
        return new Ability
        ({
            id: row.ability_id,
            name: row.name,
            description: row.description,
            generation: row.generation,
            species: row.species.map((sp: RowDataPacket) => speciesAdapter.referenceForAbilityFromMySQL(sp)),
        });
    }

    toMySQL(requestBody: AbilityBody): MySQLData
    {
        return {
            name: requestBody.name,
            description: requestBody.description,
            generation_id: requestBody.generationId,
        };
    }

    referenceForSpeciesFromMySQL(row: RowDataPacket): AbilityReferenceForSpecies
    {
        return new AbilityReferenceForSpecies(row.name, row.ability_id, row.is_hidden);
    }
}

export default new AbilityAdapter();
