import db from "../db/mysql";
import pluralize from "pluralize";
import { Adapter, ReadOnlyAdapter } from "../adapters/adapter";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { MySQLCompatibleValue, MySQLData } from "../types/mysql-types";
import { MySQLOperation } from "../types/enums";
import { PoolConnection } from "mysql2/promise";
import { createInsertQuery, createUpdateQuery } from "../utils/mysql-generation";
import { isErrorCode } from "../utils/error-handling";
import { capitaliseTableNameSingular, sanitiseTableTableSingular } from "../utils/helpers";

export abstract class ReadOnlyService<TModel>
{
    protected abstract adapter: ReadOnlyAdapter<TModel>;
    protected abstract tableName: string;
    protected abstract tableAlias: string;
    protected abstract idField: string;
    protected abstract searchField: string;
    protected abstract baseSelectQuery: string;

    protected handleReadError(error: unknown, id?: number): never
    {
        const singularName = sanitiseTableTableSingular(this.tableName);
        const prefix = `Error fetching ${singularName}${id ? ` with ID ${id}` : ""}: `;

        const specificErrorMessage = this.getSpecificReadErrorMessage(error);
        if (specificErrorMessage) throw new Error(`${prefix}${specificErrorMessage}`);

        throw new Error(`${prefix}${(error as Error).message}`);
    }

    protected getSpecificReadErrorMessage(_error: unknown): string | null
    {
        // Intentionally empty, inherited classes can provide custom error handling.
        return null;
    }

    protected async adaptToModel(row: RowDataPacket): Promise<TModel>
    {
        return this.adapter.fromMySQL(row);
    }

    async find(search?: string): Promise<TModel[]>
    {
        try
        {
            let query = this.baseSelectQuery;
            const params: MySQLCompatibleValue[] = [];

            if (search)
            {
                query += ` WHERE ${this.tableAlias}.${this.searchField} LIKE ?`;
                params.push(`%${search}%`);
            }

            const rows = await db.queryTyped<RowDataPacket>(query + ` ORDER BY ${this.tableAlias}.${this.idField}`, params);
            return Promise.all(rows.map(async row => await this.adaptToModel(row)));
        }
        catch (error)
        {
            throw this.handleReadError(error);
        }
    }

    async getById(id: number): Promise<TModel | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE ${this.tableAlias}.${this.idField} = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [id]);
            return row ? await this.adaptToModel(row) : null;
        }
        catch (error)
        {
            throw this.handleReadError(error, id);
        }
    }

    async count(): Promise<number>
    {
        try
        {
            const query = `SELECT COUNT(${this.tableAlias}.${this.idField}) AS count FROM ${this.tableName} ${this.tableAlias}`;
            const row = await db.queryOne<RowDataPacket>(query, []);
            return row ? row.count : 0;
        }
        catch (error)
        {
            throw this.handleReadError(error);
        }
    }
}

export abstract class Service<TModel, TBody> extends ReadOnlyService<TModel>
{
    protected abstract override adapter: Adapter<TModel, TBody>;

    protected handleWriteError(error: unknown, body: TBody, operation: MySQLOperation, id?: number): never
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
        }

        const specificErrorMessage = this.getSpecificWriteErrorMessage(error, body);
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

    protected getSpecificWriteErrorMessage(_error: unknown, _body: TBody): string | null
    {
        // Intentionally empty, inherited classes can provide custom error handling.
        return null;
    }

    protected async processRequestBody(body: TBody): Promise<TBody>
    {
        return body;
    }

    protected async adaptToDatabase(body: TBody): Promise<MySQLData>
    {
        return this.adapter.toMySQL(body);
    }

    protected async insertRelations(_connection: PoolConnection, _id: number, _body: TBody): Promise<void>
    {
        // Intentionally empty, inherited classes can provide additional relation inserts.
    }

    async create(body: TBody): Promise<TModel>
    {
        const connection = await db.getConnection();

        try
        {
            await connection.beginTransaction();

            const processedBody = await this.processRequestBody(body);
            const data = await this.adaptToDatabase(processedBody);

            const query = createInsertQuery(this.tableName, data);
            const [result] = await connection.query<ResultSetHeader>(query.sql, query.params);

            await this.insertRelations(connection, result.insertId, body);

            connection.commit();
            connection.release();

            return await this.getById(result.insertId) as TModel;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();

            throw this.handleWriteError(error, body, MySQLOperation.Create);
        }
    }

    async update(id: number, body: TBody): Promise<TModel | null>
    {
        const connection = await db.getConnection();

        try
        {
            await connection.beginTransaction();

            const processedBody = await this.processRequestBody(body);
            const data = await this.adaptToDatabase(processedBody);

            const query = createUpdateQuery(this.tableName, this.idField, data);
            if (query)
            {
                query.params.push(id);

                const [result] = await connection.query<ResultSetHeader>(query.sql, query.params);

                if (result.affectedRows === 0)
                {
                    await connection.rollback();
                    connection.release();

                    return null;
                }
            }

            await this.insertRelations(connection, id, body);

            connection.commit();
            connection.release();

            return await this.getById(id) as TModel;
        }
        catch (error)
        {
            await connection.rollback();
            connection.release();

            throw this.handleWriteError(error, body, MySQLOperation.Update, id);
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
            throw this.handleWriteError(error, {} as TBody, MySQLOperation.Delete, id);
        }
    }
}

export class NameLookup<TModel>
{
    constructor(
        private readonly tableName: string,
        private readonly tableAlias: string,
        private readonly idField: string,
        private readonly nameField: string,
        private readonly baseSelectQuery: string,
        private readonly adaptToModel: (row: RowDataPacket)=> Promise<TModel>
    )
    {}

    async getByName(name: string): Promise<TModel | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE ${this.tableAlias}.${this.nameField} = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [name]);
            return row ? await this.adaptToModel(row) : null;
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
            const query = `SELECT ${this.idField} AS id FROM ${this.tableName} ${this.tableAlias} WHERE LOWER(${this.tableAlias}.${this.nameField}) = LOWER(?)`;
            const result = await db.queryOne<{ id: number }>(query, [name]);
            return (!result || !result.id) ? Promise.reject(new Error(`${capitaliseTableNameSingular(this.tableName)} '${name}' does not exist.`)) : result.id;
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName} ID for ${name}: ${(error as Error).message}`);
        }
    }
}

export abstract class NameLookupReadOnlyService<TModel> extends ReadOnlyService<TModel>
{
    protected abstract nameField: string;
    get nameLookup(): NameLookup<TModel>
    {
        return new NameLookup(
            this.tableName,
            this.tableAlias,
            this.idField,
            this.nameField,
            this.baseSelectQuery,
            this.adaptToModel.bind(this)
        );
    }
}

export abstract class NameLookupService<TModel, TBody> extends Service<TModel, TBody>
{
    protected abstract nameField: string;
    get nameLookup(): NameLookup<TModel>
    {
        return new NameLookup(
            this.tableName,
            this.tableAlias,
            this.idField,
            this.nameField,
            this.baseSelectQuery,
            this.adaptToModel.bind(this)
        );
    }
}
