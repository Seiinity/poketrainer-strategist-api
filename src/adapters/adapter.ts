import { RowDataPacket } from "mysql2";
import { MySQLData } from "../types/mysql-types";

export abstract class Adapter<Model, ModelBody>
{
    abstract fromMySQL(row: RowDataPacket): Model;
    abstract toMySQL(requestBody: ModelBody): MySQLData;
}
