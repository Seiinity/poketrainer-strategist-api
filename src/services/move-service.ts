import db from "../db/mysql";
import moveCategoryService from "./move-category-service";
import moveAdapter from "../adapters/move-adapter";
import typeService from "./type-service";
import { NameLookupService } from "./service";
import { Move, MoveBody } from "../models/move";
import { RowDataPacket } from "mysql2";

class MoveService extends NameLookupService<Move, MoveBody>
{
    protected adapter = moveAdapter;
    protected tableName = "moves";
    protected tableAlias = "mv";
    protected idField = "move_id";
    protected nameField = "name";
    protected searchField = "name";

    protected baseSelectQuery = `
        SELECT
            mv.*,
            tp.type_id, tp.name AS type_name,
            mc.move_category_id, mc.name AS move_category_name,
            gn.name AS generation
        FROM moves mv
        LEFT JOIN types tp ON mv.type_id = tp.type_id
        LEFT JOIN move_categories mc ON mv.move_category_id = mc.move_category_id
        LEFT JOIN generations gn ON mv.generation_id = gn.generation_id
    `;

    protected override async processRequestBody(body: MoveBody): Promise<MoveBody>
    {
        const processed = { ...body };

        if (body.type)
        {
            processed.typeId = await typeService.nameLookup.getIdByName(body.type);
        }

        if (body.category)
        {
            processed.categoryId = await moveCategoryService.nameLookup.getIdByName(body.category);
        }

        return processed;
    }

    async getBySpeciesId(speciesId: number)
    {
        try
        {
            const query = `
                SELECT mv.move_id, mv.name
                FROM moves mv
                LEFT JOIN species_learnsets sl ON mv.move_id = sl.move_id
                WHERE sl.species_id = ?
            `;
            return await db.queryTyped<RowDataPacket>(query, [speciesId]);
        }
        catch (error)
        {
            throw new Error(`Error fetching moves by species ID: ${(error as Error).message}`);
        }
    }

    async getByPokemonId(pokemonId: number)
    {
        try
        {
            const query = `
                SELECT mv.move_id, mv.name
                FROM moves mv
                LEFT JOIN pokemon_moves pm ON mv.move_id = pm.move_id
                WHERE pm.pokemon_id = ?
                ORDER BY pm.slot
            `;
            return await db.queryTyped<RowDataPacket>(query, [pokemonId]);
        }
        catch (error)
        {
            throw new Error(`Error fetching moves by Pokémon ID: ${(error as Error).message}`);
        }
    }
}

export default new MoveService();
