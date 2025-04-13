import { NameLookupReadOnlyService } from "./service";
import { MoveCategory } from "../models/move-category";
import moveCategoryAdapter from "../adapters/move-category-adapter";

class MoveCategoryService extends NameLookupReadOnlyService<MoveCategory>
{
    protected adapter = moveCategoryAdapter;
    protected tableName = "move_categories";
    protected tableAlias = "mc";
    protected idField = "move_category_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = `SELECT * FROM ${this.tableName} ${this.tableAlias}`;
}

export default new MoveCategoryService();
