import moveAdapter from "../adapters/move-adapter";
import { Service } from "./service";
import { Move, MoveBody } from "../models/move";

class MoveService extends Service<Move, MoveBody>
{
    protected adapter = moveAdapter;
    protected tableName = "moves";
    protected tableAlias = "mv";
    protected idField = "move_id";
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
}

export default new MoveService();