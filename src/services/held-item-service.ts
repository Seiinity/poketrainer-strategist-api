import { NameLookupService } from "./service";
import { HeldItem, HeldItemBody } from "../models/held-item";
import heldItemAdapter from "../adapters/held-item-adapter";

class HeldItemService extends NameLookupService<HeldItem, HeldItemBody>
{
    protected adapter = heldItemAdapter;
    protected tableName = "held_items";
    protected tableAlias = "hi";
    protected idField = "held_item_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = `SELECT * FROM ${this.tableName} ${this.tableAlias}`;
}

export default new HeldItemService();