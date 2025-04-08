import db from "../db/mysql";
import { Species, SpeciesBody } from "../models/species";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import typesService from "./type-service";
import { isErrorCode } from "../utils/error-handling";
import { SpeciesAdapter } from "../adapters/species-adapter";

/* CRUD methods. */

const baseSelectQuery =
`
    SELECT 
        s.id, s.name, s.height, s.weight,
        t1.id AS type1_id, t1.name AS type1_name, 
        t2.id AS type2_id, t2.name AS type2_name,
        g.male_rate, g.female_rate
    FROM species s
    LEFT JOIN types t1 ON s.type_1_id = t1.id
    LEFT JOIN types t2 ON s.type_2_id = t2.id
    LEFT JOIN gender_ratios g ON s.gender_ratio_id = g.id
`;

async function getAllSpecies(): Promise<Species[]>
{
    try
    {
        const rows = await db.queryTyped<RowDataPacket>(baseSelectQuery);
        return rows.map(row => SpeciesAdapter.fromMySQL(row));
    }
    catch (error)
    {
        throw new Error(`Error fetching species: ${(error as Error).message}`);
    }
}

async function getSpeciesById(id: number): Promise<Species | null>
{
    try
    {
        const row = await db.queryOne<RowDataPacket>(`${baseSelectQuery} WHERE s.id = ?`, [id]);
        return row ? SpeciesAdapter.fromMySQL(row) : null;
    }
    catch (error)
    {
        throw new Error(`Error fetching species with ID ${id}: ${(error as Error).message}`);
    }
}

async function createSpecies(newSpecies: SpeciesBody): Promise<Species>
{
    try
    {
        const typeIds = await Promise.all
        (
            newSpecies.typeNames.map(async (typeName) =>
            {
                return await typesService.getTypeIdByName(typeName);
            })
        );

        const sql = "INSERT INTO species VALUES (NULL, ?, ?, ?, ?, ?, ?)";
        const params = [newSpecies.name, typeIds[0], typeIds[1], newSpecies.genderRatioId, newSpecies.height, newSpecies.weight];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return await getSpeciesById(result.insertId) as Species;
    }
    catch (error)
    {
        throw new Error(`Error creating species: ${(error as Error).message}`);
    }
}

async function updateSpeciesById(id: number, newSpecies: SpeciesBody): Promise<Species | null>
{
    try
    {
        const typeIds = await Promise.all
        (
            newSpecies.typeNames.map(async (typeName) =>
            {
                return await typesService.getTypeIdByName(typeName);
            })
        );

        const sql = "UPDATE species SET name = ?, type_1_id = ?, type_2_id = ?, gender_ratio_id = ?, height = ?, weight = ? WHERE id = ?";
        const params = [newSpecies.name, typeIds[0], typeIds[1], newSpecies.genderRatioId, newSpecies.height, newSpecies.weight, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows == 0) return null;
        return await getSpeciesById(id) as Species;
    }
    catch (error)
    {
        throw new Error(`Error updating species with ID ${id}: ${(error as Error).message}`);
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
        if (isErrorCode(error, "ER_ROW_IS_REFERENCED_2"))
        {
            throw new Error("Cannot delete this species as it is referenced by other records.");
        }

        throw new Error(`Error deleting species by ID: ${(error as Error).message}`);
    }
}

/* Additional methods. */

async function getSpeciesIdByName(name: string): Promise<number>
{
    try
    {
        const species = await db.queryOne<Species>("SELECT id FROM species WHERE LOWER(name) = LOWER(?)", [name]);
        return (!species || !species.id) ? Promise.reject(new Error(`Unknown species '${name}'`)) : species.id;
    }
    catch (error)
    {
        throw new Error(`Error fetching trainer ID for ${name}: ${(error as Error).message}`);
    }
}

export default
{
    getAllSpecies,
    getSpeciesById,
    createSpecies,
    updateSpeciesById,
    deleteSpeciesById,

    getSpeciesIdByName
};