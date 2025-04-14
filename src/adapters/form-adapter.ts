import { Adapter } from "./adapter";
import { Form, FormBody } from "../models/form";
import { RowDataPacket } from "mysql2";
import { SpeciesReference } from "../models/species";
import { TypeReference } from "../models/type";
import abilityAdapter from "./ability-adapter";
import statAdapter from "./stat-adapter";
import moveAdapter from "./move-adapter";
import { MySQLData } from "../types/mysql-types";

class FormAdapter extends Adapter<Form, FormBody>
{
    fromMySQL(row: RowDataPacket): Form
    {
        return new Form
        ({
            id: row.form_id,
            name: row.name,
            species: new SpeciesReference(row.species_name, row.species_id),
            types: [
                new TypeReference(row.type_1_name, row.type_1_id),
                ...row.type_2_id ? [new TypeReference(row.type_2_name, row.type_2_id)] : []
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

    toMySQL(requestBody: FormBody): MySQLData
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
}

export default new FormAdapter();
