import db from "../db/mysql";
import pluralize from "pluralize";
import capitalize from "lodash.capitalize";
import { Adapter } from "../adapters/adapter";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { MySQLCompatibleValue, MySQLData } from "../types/mysql-types";
import { createInsertQuery, createUpdateQuery } from "../utils/mysql-generation";
import { isErrorCode } from "../utils/error-handling";
import { MySQLOperation } from "../types/enums";
import { Connection } from "mysql2/promise";

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

    protected async adaptToDatabase(body: ModelBody): Promise<MySQLData>
    {
        return this.adapter.toMySQL(body);
    }

    protected getSpecificErrorMessage(_error: unknown, _body: ModelBody): string | null
    {
        // Intentionally empty, inherited classes can provide custom error handling.
        return null;
    }

    protected handleError(error: unknown, body: ModelBody, operation: MySQLOperation, id?: number): never
    {
        const singularName = pluralize.singular(this.tableName);
        let prefix = "";

        switch (operation)
        {
            case MySQLOperation.Create:
                prefix = `Error creating ${singularName}: `;
                break;
            case MySQLOperation.Update:
                prefix = `Error updating ${singularName} with ID ${id}: `;
                break;
            case MySQLOperation.Delete:
                prefix = `Error deleting ${singularName} with ID ${id}: `;
                break;
            case MySQLOperation.Fetch:
                prefix = `Error fetching ${singularName}${id ? ` with ID ${id}` : ""}: `;
                break;
        }

        const specificErrorMessage = this.getSpecificErrorMessage(error, body);
        if (specificErrorMessage) throw new Error(`${prefix}${specificErrorMessage}`);

        if (isErrorCode(error, "ER_DUP_ENTRY"))
        {
            throw new Error(`${prefix}A duplicate ${singularName} already exists.`);
        }

        if (isErrorCode(error, "ER_ROW_IS_REFERENCED_2"))
        {
            throw new Error(`${prefix}Cannot delete this ${singularName} as it is referenced by other records.`);
        }

        throw new Error(`${prefix}${(error as Error).message}`);
    }

    async find(search?: string): Promise<Model[]>
    {
        try
        {
            let query = this.baseSelectQuery;
            const params: MySQLCompatibleValue[] = [];

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
            throw this.handleError(error, {} as ModelBody, MySQLOperation.Fetch);
        }
    }

    async getById(id: number): Promise<Model | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE ${this.idField} = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [id]);
            return row ? await this.adaptToModel(row) : null;
        }
        catch (error)
        {
            throw this.handleError(error, {} as ModelBody, MySQLOperation.Fetch, id);
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
            throw this.handleError(error, body, MySQLOperation.Create);
        }
    }

    async update(id: number, body: ModelBody, connection?: Connection): Promise<Model | null>
    {
        try
        {
            const processedBody = await this.processRequestBody(body);
            const data = await this.adaptToDatabase(processedBody);

            const query = createUpdateQuery(this.tableName, this.idField, data);
            query.params.push(id);

            const toQuery = connection ? connection : db;
            const [result] = await toQuery.query<ResultSetHeader>(query.sql, query.params);

            if (result.affectedRows === 0) return null;
            return await this.getById(id) as Model;
        }
        catch (error)
        {
            throw this.handleError(error, body, MySQLOperation.Update, id);
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
            throw this.handleError(error, {} as ModelBody, MySQLOperation.Delete, id);
        }
    }
}

export abstract class NameLookupService<Model, ModelBody> extends Service<Model, ModelBody>
{
    protected abstract nameField: string;

    async getByName(name: string): Promise<Model | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE ${this.nameField} = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [name]);
            return row ? this.adapter.fromMySQL(row) : null;
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName} named ${name}: ${(error as Error).message}`);
        }
    }

    async getIdByName(name: string): Promise<number>
    {
        try
        {
            const query = `SELECT ${this.idField} AS id FROM ${this.tableName} WHERE LOWER(${this.nameField}) = LOWER(?)`;
            const result = await db.queryOne<{ id: number }>(query, [name]);
            return (!result || !result.id) ? Promise.reject(new Error(`${capitalize(pluralize.singular(this.tableName))} '${name}' does not exist.`)) : result.id;
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName} ID for ${name}: ${(error as Error).message}`);
        }
    }
}
