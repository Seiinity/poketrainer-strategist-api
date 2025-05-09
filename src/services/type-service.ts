﻿import db from "../db/mysql";
import typeAdapter from "../adapters/type-adapter";
import { NameLookupService } from "./service";
import { Type, TypeBody, TypeEffectiveness } from "../models/type";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

class TypeService extends NameLookupService<Type, TypeBody>
{
    protected adapter = typeAdapter;
    protected tableName = "types";
    protected tableAlias = "tp";
    protected idField = "type_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = "SELECT * FROM types tp";

    protected override async adaptToModel(row: RowDataPacket): Promise<Type>
    {
        row.effectiveness = await this.getTypeEffectivenessById(row.type_id);
        return super.adaptToModel(row);
    }

    protected override async insertRelations(connection: PoolConnection, id: number, body: TypeBody): Promise<void>
    {
        await this.insertEffectivenessRelations(connection, id, body);
    }

    async getTypeEffectivenessById(id: number): Promise<TypeEffectiveness>
    {
        try
        {
            const query = `
                SELECT 
                    te.attacking_type_id,
                    at.name as attacking_type_name,
                    te.defending_type_id,
                    dt.name as defending_type_name,
                    te.modifier
                FROM type_effectiveness te
                JOIN types at ON te.attacking_type_id = at.type_id
                JOIN types dt ON te.defending_type_id = dt.type_id
                WHERE te.attacking_type_id = ? OR te.defending_type_id = ?
            `;

            const rows = await db.queryTyped<RowDataPacket>(query, [id, id]);
            return this.adapter.typeEffectivenessFromMySQL(rows, id);
        }
        catch (error)
        {
            this.handleReadError(error, id);
        }
    }

    private async insertEffectivenessRelations(connection: PoolConnection, id: number, body: TypeBody): Promise<void>
    {
        const values: string[] = [];
        const params: (number | string)[] = [];

        const addEffectiveness = (attacker: number, defender: number, modifier: number) =>
        {
            values.push("(?, ?, ?)");
            params.push(attacker, defender, modifier);
        };

        const processRelations = async (types: string[] | undefined, isAttacking: boolean, modifier: number) =>
        {
            if (!types) return;

            const idToDelete = isAttacking ? "attacking_type_id" : "defending_type_id";
            const deleteQuery = `
                DELETE FROM type_effectiveness 
                WHERE ${idToDelete} = ? AND modifier = ?
            `;
            await connection.execute(deleteQuery, [id, modifier]);

            for (const type of types)
            {
                const otherTypeId = await this.nameLookup.getIdByName(type);
                if (isAttacking) addEffectiveness(id, otherTypeId, modifier);
                else addEffectiveness(otherTypeId, id, modifier);
            }
        };

        await processRelations(body.weakTo, false, 2);
        await processRelations(body.resistantTo, false, 0.5);
        await processRelations(body.immuneTo, false, 0);
        await processRelations(body.strongAgainst, true, 2);
        await processRelations(body.weakAgainst, true, 0.5);
        await processRelations(body.ineffectiveAgainst, true, 0);

        if (values.length > 0)
        {
            const insertQuery = `
                INSERT INTO type_effectiveness 
                    (attacking_type_id, defending_type_id, modifier) 
                VALUES ${values.join(", ")}
            `;
            await connection.execute(insertQuery, params);
        }
    }
}

export default new TypeService();
