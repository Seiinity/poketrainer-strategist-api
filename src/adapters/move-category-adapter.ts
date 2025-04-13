import { ReadOnlyAdapter } from "./adapter";
import { MoveCategory } from "../models/move-category";
import { RowDataPacket } from "mysql2";

class MoveCategoryAdapter extends ReadOnlyAdapter<MoveCategory>
{
    fromMySQL(row: RowDataPacket): MoveCategory
    {
        return new MoveCategory
        ({
            id: row.move_category_id,
            name: row.name,
        });
    }
}

export default new MoveCategoryAdapter();
