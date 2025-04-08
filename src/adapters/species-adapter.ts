import { Species, SpeciesBody } from "../models/species";
import { TypeReference } from "../models/type";
import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";

export class SpeciesAdapter extends Adapter<Species, SpeciesBody>
{
    fromMySQL(row: RowDataPacket): Species
    {
        return new Species
        ({
            id: row.id,
            name: row.name,
            types: TypeReference.build([
                { id: row.type1_id, name: row.type1_name },
                { id: row.type2_id, name: row.type2_name }
            ]),
            genderRatio: `${row.male_rate}M:${row.female_rate}F`,
            height: Number(row.height),
            weight: Number(row.weight),
        });
    }

    toMySQL(speciesBody: SpeciesBody): Record<string, any>
    {
        return {
            name: speciesBody.name,
            type_1_id: speciesBody.type1Id,
            type_2_id: speciesBody.type2Id || null,
            gender_ratio_id: speciesBody.genderRatioId,
            height: speciesBody.height,
            weight: speciesBody.weight
        }
    }
}