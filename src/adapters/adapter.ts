import { RowDataPacket } from "mysql2";

export abstract class Adapter<Model, ModelBody>
{
    abstract fromMySQL(row: RowDataPacket): Model;
    abstract toMySQL(requestBody: ModelBody): Record<string, any>;
}