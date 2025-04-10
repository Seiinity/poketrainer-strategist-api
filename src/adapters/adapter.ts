import { RowDataPacket } from "mysql2";
import { MySQLData } from "../types/mysql-types";

export abstract class ReadOnlyAdapter<TModel>
{
    abstract fromMySQL(row: RowDataPacket): TModel;
}

export abstract class Adapter<TModel, TBody> extends ReadOnlyAdapter<TModel>
{
    abstract toMySQL(requestBody: TBody): MySQLData;
}
