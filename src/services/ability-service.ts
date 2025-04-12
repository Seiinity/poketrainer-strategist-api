import db from "../db/mysql";
import speciesService from "./species-service";
import abilityAdapter from "../adapters/ability-adapter";
import { NameLookupService } from "./service";
import { Ability, AbilityBody } from "../models/ability";
import { getMySQLForeignKeyErrorConstraint } from "../utils/error-handling";
import { RowDataPacket } from "mysql2";

export class AbilityService extends NameLookupService<Ability, AbilityBody>
{
    protected adapter = abilityAdapter;
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

    protected async adaptToModel(row: RowDataPacket): Promise<Ability>
    {
        row.species = await speciesService.getByAbilityId(row.ability_id);
        return super.adaptToModel(row);
    }

    protected override getSpecificWriteErrorMessage(error: unknown, body: AbilityBody): string | null
    {
        if (getMySQLForeignKeyErrorConstraint(error) == "abilities_generations_generation_id_fk")
        {
            return `Generation with ID ${body.generationId} does not exist.`;
        }

        return null;
    }

    async getBySpeciesId(speciesId: number): Promise<RowDataPacket[]>
    {
        try
        {
            return await db.queryTyped<RowDataPacket>
            (
                `SELECT a.ability_id, a.name, s.is_hidden
                FROM species_abilities s
                      JOIN abilities a ON s.ability_id = a.ability_id
                WHERE species_id = ?
                ORDER BY s.slot`,
                [speciesId]
            );
        }
        catch (error)
        {
            throw new Error(`Error fetching ability by species ID: ${(error as Error).message}`);
        }
    }
}

export default new AbilityService();
