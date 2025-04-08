import { Adapter } from "../adapters/adapter";
import db from "../db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createInsertQuery, createUpdateQuery } from "../utils/mysql-generation";
import { isErrorCode } from "../utils/error-handling";

export abstract class Service<Model, ModelBody>
{
    protected abstract adapter: Adapter<Model, ModelBody>;
    protected abstract tableName: string;
    protected abstract idField: string;
    protected abstract searchField: string;
    protected abstract baseSelectQuery: string;

    protected async processRequestBody(body: ModelBody): Promise<ModelBody>
    {
        return body;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<Model>
    {
        return this.adapter.fromMySQL(row);
    }

    protected async adaptToDatabase(body: ModelBody): Promise<Record<string, any>>
    {
        return this.adapter.toMySQL(body);
    }

    async find(search?: string): Promise<Model[]>
    {
        try
        {
            let query = this.baseSelectQuery;
            const params: any[] = [];

            if (search)
            {
                query += ` WHERE ${this.searchField} LIKE ?`;
                params.push(`%${search}%`);
            }

            const rows = await db.queryTyped<RowDataPacket>(query, params);
            return Promise.all(rows.map(async row => await this.adaptToModel(row)));
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName}: ${(error as Error).message}`);
        }
    }

    async getById(id: number): Promise<Model | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE ${this.idField} = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [id]);
            return row ? await this.adapter.fromMySQL(row) : null;
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName} with ID ${id}: ${(error as Error).message}`);
        }
    }

    async create(body: ModelBody): Promise<Model>
    {
        try
        {
            const processedBody = await this.processRequestBody(body);
            const data = await this.adaptToDatabase(processedBody);

            const query = createInsertQuery(this.tableName, data);
            const [result] = await db.query<ResultSetHeader>(query.sql, query.params);

            return await this.getById(result.insertId) as Model;
        }
        catch (error)
        {
            throw new Error(`Error creating ${this.tableName}: ${(error as Error).message}`);
        }
    }

    async update(id: number, body: ModelBody): Promise<Model | null>
    {
        try
        {
            const processedBody = await this.processRequestBody(body);
            const data = await this.adaptToDatabase(processedBody);

            const query = createUpdateQuery(this.tableName, this.idField, data);
            query.params.push(id);

            const [result] = await db.query<ResultSetHeader>(query.sql, query.params);

            if (result.affectedRows === 0) return null;
            return await this.getById(id) as Model;
        }
        catch (error)
        {
            throw new Error(`Error updating ${this.tableName} with ID ${id}: ${(error as Error).message}`);
        }
    }

    async delete(id: number): Promise<boolean>
    {
        try
        {
            const [result] = await db.query<ResultSetHeader>(`DELETE FROM ${this.tableName} WHERE ${this.idField} = ?`, [id]);
            return result.affectedRows > 0;
        }
        catch (error)
        {
            if (isErrorCode(error, "ER_ROW_IS_REFERENCED_2"))
            {
                throw new Error(`Cannot delete this ${this.tableName} as it is referenced by other records.`);
            }
            throw new Error(`Error deleting ${this.tableName} by ID: ${(error as Error).message}`);
        }
    }
}