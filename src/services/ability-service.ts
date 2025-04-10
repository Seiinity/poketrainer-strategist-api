import { NameLookupService } from "./service";
import { Ability, AbilityBody } from "../models/ability";
import { AbilityAdapter } from "../adapters/ability-adapter";
import { getMySQLForeignKeyErrorConstraint } from "../utils/error-handling";
import db from "../db/mysql";
import { RowDataPacket } from "mysql2";

export class AbilityService extends NameLookupService<Ability, AbilityBody>
{
    protected adapter = new AbilityAdapter();
    protected tableName = "abilities";
    protected tableAlias = "ab";
    protected idField = "ability_id";
    protected searchField = "name";
    protected nameField = "name";

    protected baseSelectQuery = `
        SELECT
            ab.*,
            gn.name as generation
        FROM abilities ab
            LEFT JOIN generations gn ON ab.generation_id = gn.generation_id
    `;

    protected getSpecificErrorMessage(error: unknown, body: AbilityBody): string | null
    {
        if (getMySQLForeignKeyErrorConstraint(error) == "abilities_generations_generation_id_fk")
        {
            return `Generation with ID ${body.generationId} does not exist.`;
        }

        return null;
    }

    async getReferencesBySpeciesId(id: number)
    {
        try
        {
            const rows = await db.queryTyped<RowDataPacket>
            (
                `SELECT a.ability_id, a.name, s.is_hidden
                FROM species_abilities s
                      JOIN abilities a ON s.ability_id = a.ability_id
                WHERE species_id = ?
                ORDER BY s.slot`,
                [id]
            );

            return rows.map(row => this.adapter.speciesReferenceFromSQL(row));
        }
        catch (error)
        {
            throw new Error(`Error fetching ability reference by species ID: ${(error as Error).message}`);
        }
    }
}

export default new AbilityService();
