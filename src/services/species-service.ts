import db from "../db/mysql";
import { Species, SpeciesBody } from "../models/species";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import typesService from "./types-service";
import config from "../config";
import { TypeReference } from "../models/type";

async function getAllSpecies(): Promise<Species[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>
        (
            `SELECT 
                s.id, s.name, 
                t1.id AS type1_id, t1.name AS type1_name, 
                t2.id AS type2_id, t2.name AS type2_name
            FROM species s
            LEFT JOIN types t1 ON s.type_1_id = t1.id
            LEFT JOIN types t2 ON s.type_2_id = t2.id`
        );

        return rows.map(row =>
        ({
            id: row.id,
            name: row.name,
            types: TypeReference.build([
                { id: row.type1_id, name: row.type1_name },
                { id: row.type2_id, name: row.type2_name }
            ])
        }));
    }
    catch (error)
    {
        console.error(`Error fetching species: ${error}`);
        throw new Error("Could not fetch species.");
    }
}

async function getSpeciesById(id: number): Promise<Species | null>
{
    try
    {
        const species = await db.queryOne<RowDataPacket>
        (
            `SELECT 
                s.id, s.name, 
                t1.id AS type1_id, t1.name AS type1_name, 
                t2.id AS type2_id, t2.name AS type2_name
            FROM species s
            LEFT JOIN types t1 ON s.type_1_id = t1.id
            LEFT JOIN types t2 ON s.type_2_id = t2.id
            WHERE s.id = ?`,
            [id]
        );

        if (!species) return null;

        const types = TypeReference.build([
            { id: species.type1_id, name: species.type1_name },
            { id: species.type2_id, name: species.type2_name }
        ]);

        return {
            id: species.id,
            name: species.name,
            types: types
        };
    }
    catch (error)
    {
        console.error(`Error fetching species with ID ${id}: ${error}`);
        throw new Error("Could not fetch species.");
    }
}

async function createSpecies(newSpecies: SpeciesBody): Promise<Species>
{
    try
    {
        const typeIds = await Promise.all
        (
            newSpecies.types.map(async (typeName) =>
            {
                return await typesService.getTypeIdByName(typeName);
            })
        );

        const sql = "INSERT INTO species VALUES (NULL, ?, ?, ?)";
        const params = [newSpecies.name, typeIds[0], typeIds[1]];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            name: newSpecies.name,
            types: newSpecies.types.map((typeName, index) => ({
                name: typeName,
                url: `${config.baseUrl}/api/types/${typeIds[index]}`
            }))
        };
    }
    catch (error)
    {
        console.error(`Error creating species: ${error}`);
        throw new Error("Could not create species.");
    }
}

async function updateSpeciesById(id: number, updateSpecies: SpeciesBody): Promise<Species | null>
{
    try
    {
        const typeIds = await Promise.all
        (
            updateSpecies.types.map(async (typeName) =>
            {
                return await typesService.getTypeIdByName(typeName);
            })
        );

        const sql = "UPDATE species SET name = ?, type_1_id = ?, type_2_id = ? WHERE id = ?";
        const params = [updateSpecies.name, typeIds[0], typeIds[1], id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;

        return {
            id,
            name: updateSpecies.name,
            types: updateSpecies.types.map((typeName, index) => ({
                name: typeName,
                url: `${config.baseUrl}/api/types/${typeIds[index]}`
            }))
        };
    }
    catch (error)
    {
        console.error(`Error update species with ID ${id}: ${error}`);
        throw new Error("Could not update species.");
    }
}

async function deleteSpeciesById(id: number): Promise<boolean>
{
    try
    {
        const [result] = await db.query<ResultSetHeader>("DELETE FROM species WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    catch (error)
    {
        console.error(`Error deleting species by ID: ${error}`);
        throw new Error("Could not delete species.");
    }
}

export default
{
    getAllSpecies,
    getSpeciesById,
    createSpecies,
    updateSpeciesById,
    deleteSpeciesById
};