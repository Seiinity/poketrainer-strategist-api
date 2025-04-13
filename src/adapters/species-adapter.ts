import { Species, SpeciesBody, SpeciesReferenceForAbility } from "../models/species";
import { TypeReference } from "../models/type";
import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";
import abilityAdapter from "./ability-adapter";
import statAdapter from "./stat-adapter";
import moveAdapter from "./move-adapter";

class SpeciesAdapter extends Adapter<Species, SpeciesBody>
{
    fromMySQL(row: RowDataPacket): Species
    {
        return new Species
        ({
            id: row.species_id,
            name: row.name,
            types: [
                new TypeReference(row.type1_name, row.type1_id),
                ...row.type2_id ? [new TypeReference(row.type2_name, row.type2_id)] : []
            ],
            genderRatio: row.male_rate == null ? "Genderless" : `${row.male_rate}M:${row.female_rate}F`,
            height: Number(row.height),
            weight: Number(row.weight),
            abilities: row.abilities.map((a: RowDataPacket) => abilityAdapter.referenceForSpeciesFromMySQL(a)),
            baseStats: row.base_stats.map((s: RowDataPacket) => statAdapter.referenceForSpeciesFromMySQL(s)),
            learnset: row.learnset.map((m: RowDataPacket) => moveAdapter.referenceFromMySQL(m)),
            generation: row.generation,
        });
    }

    toMySQL(requestBody: SpeciesBody): MySQLData
    {
        return {
            species_id: requestBody.id,
            name: requestBody.name,
            type_1_id: requestBody.type1Id,
            type_2_id: requestBody.type2Id,
            gender_ratio_id: requestBody.genderRatioId,
            height: requestBody.height,
            weight: requestBody.weight,
            generation_id: requestBody.generationId,
        };
    }

    referenceForAbilityFromMySQL(data: RowDataPacket)
    {
        return new SpeciesReferenceForAbility(data.name, data.species_id, data.is_hidden);
    }
}

export default new SpeciesAdapter();
