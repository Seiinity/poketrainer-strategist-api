import { NameLookupService } from "./service";
import { Ability, AbilityBody } from "../models/ability";
import { AbilityAdapter } from "../adapters/ability-adapter";
import { getMySQLForeignKeyErrorConstraint } from "../utils/error-handling";

export class AbilityService extends NameLookupService<Ability, AbilityBody>
{
    protected adapter = new AbilityAdapter();
    protected tableName = "abilities";
    protected idField = "ability_id";
    protected searchField = "a.name";
    protected nameField = "a.name";

    protected baseSelectQuery = `
        SELECT
            a.*,
            g.name as generation
        FROM abilities a
            LEFT JOIN generations g ON a.generation_id = g.generation_id
    `;

    protected getSpecificErrorMessage(error: unknown, body: AbilityBody): string | null
    {
        if (getMySQLForeignKeyErrorConstraint(error) == "abilities_generations_generation_id_fk")
        {
            return `Generation with ID ${body.generationId} does not exist.`;
        }

        return null;
    }
}

export default new AbilityService();
