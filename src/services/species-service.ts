import db from "../db/mysql";
import { Species } from "../models/species";
import { ResultSetHeader } from "mysql2";

async function getAllSpecies(): Promise<Species[]>
{
    try
    {
        return await db.queryTyped<Species>("SELECT * FROM species");
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
        return await db.queryOne<Species>(
            "SELECT * FROM species WHERE id = ?",
            [id]
        );
    }
    catch (error)
    {
        console.error(`Error fetching species by ID: ${error}`);
        throw new Error("Could not fetch species.");
    }
}

async function createSpecies(newSpecies: Species)
{
    try
    {
        const sql = "INSERT INTO species VALUES (NULL, ?)";
        const params = [newSpecies.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        const inserted: Species =
        {
            id: result.insertId,
            ...newSpecies,
        }

        return inserted;
    }
    catch (error)
    {
        console.error(`Error creating species: ${error}`);
        throw new Error("Could not create species.");
    }
}

function updateSpeciesById(id: number, updateSpecies: Species)
{
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