import { RowDataPacket } from "mysql2";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";
import { Ability, AbilityBody } from "../models/ability";

export class AbilityAdapter extends Adapter<Ability, AbilityBody>
{
    fromMySQL(row: RowDataPacket): Ability
    {
        return new Ability
        ({
            id: row.ability_id,
            name: row.name,
            description: row.description,
            generation: row.generation,
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
}
