import { RowDataPacket } from "mysql2";
import { Type, TypeBody, TypeEffectiveness, TypeReference } from "../models/type";
import { TeamBody } from "../models/team";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";

class TypeAdapter extends Adapter<Type, TypeBody>
{
    fromMySQL(row: RowDataPacket): Type
    {
        return new Type
        ({
            id: row.type_id,
            name: row.name,
            effectiveness: row.effectiveness,
        });
    }

    toMySQL(requestBody: TeamBody): MySQLData
    {
        return {
            name: requestBody.name,
        };
    }

    typeEffectivenessFromMySQL(rows: RowDataPacket[], id: number): TypeEffectiveness
    {
        const effectiveness = new TypeEffectiveness();
        if (!rows || rows.length === 0) return effectiveness;

        for (const row of rows)
        {
            const modifier: number = row.modifier;
            if (modifier === 1) continue; // Failsafe.

            const defendingId: number = row.defending_type_id;
            const attackingId: number = row.attacking_type_id;

            if (defendingId == id)
            {
                const attackingType = new TypeReference(row.attacking_type_name, attackingId);
                if (modifier == 2) effectiveness.weakTo.push(attackingType);
                else if (modifier == 0.5) effectiveness.resistantTo.push(attackingType);
                else if (modifier == 0) effectiveness.immuneTo.push(attackingType);
            }

            if (attackingId == id)
            {
                const defendingType = new TypeReference(row.defending_type_name, defendingId);
                if (modifier == 2) effectiveness.strongAgainst.push(defendingType);
                else if (modifier == 0.5) effectiveness.weakAgainst.push(defendingType);
                else if (modifier == 0) effectiveness.ineffectiveAgainst.push(defendingType);
            }
        }

        return effectiveness;
    }
}

export default new TypeAdapter();
