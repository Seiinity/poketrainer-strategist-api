import { Species } from "../models/species";
import { TypeReference } from "../models/type";
import { RowDataPacket } from "mysql2";

export class SpeciesAdapter
{
    static fromMySQL(row: RowDataPacket): Species
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
}