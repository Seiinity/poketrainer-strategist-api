import { Species, SpeciesBody } from "../models/species";
import { TypeReference } from "../models/type";
import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";

export class SpeciesAdapter extends Adapter<Species, SpeciesBody>
{
    fromMySQL(row: RowDataPacket): Species
    {
        return new Species
        ({
            id: row.species_id,
            name: row.name,
            types: TypeReference.build([
                { id: row.type1_id, name: row.type1_name },
                { id: row.type2_id, name: row.type2_name }
            ]),
            genderRatio: `${row.male_rate}M:${row.female_rate}F`,
            height: Number(row.height),
            weight: Number(row.weight),
            abilities: row.abilities,
            generation: row.generation,
        });
    }

    toMySQL(requestBody: SpeciesBody): MySQLData
    {
        return {
            species_id: requestBody.id,
            name: requestBody.name,
            type_1_id: requestBody.type1Id,
            type_2_id: requestBody.type2Id || null,
            gender_ratio_id: requestBody.genderRatioId,
            height: requestBody.height,
            weight: requestBody.weight,
            generation_id: requestBody.generationId,
        };
    }
}
