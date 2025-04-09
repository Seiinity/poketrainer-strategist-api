import { NameLookupService } from "./service";
import { Type, TypeBody } from "../models/type";
import { TypeAdapter } from "../adapters/type-adapter";

class TypeService extends NameLookupService<Type, TypeBody>
{
    protected adapter = new TypeAdapter();
    protected tableName = "types";
    protected tableAlias = "tp";
    protected idField = "type_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = "SELECT * FROM types tp";
}

export default new TypeService();
