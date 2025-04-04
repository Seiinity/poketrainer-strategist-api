import db from "../db/mysql";
import { Species } from "../models/species";
import { RowDataPacket } from "mysql2";

async function getAllSpecies()
{
    try
    {
        const [rows] = await db.query("SELECT * FROM species");
        return rows;
    }
    catch (error)
    {
        console.error("Error fetching species: ", error);
        throw new Error("Could not fetch species.");
    }
}

async function getSpeciesById(id: number)
{
    try
    {
        const [rows] = await db.query<(Species & RowDataPacket)[]>(
            "SELECT * FROM species WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return null; // or throw an error if you prefer
        }

        return rows[0]; // return the first (and only) result
    }
    catch (error)
    {
        console.error("Error fetching species by ID: ", error);
        throw new Error("Could not fetch species.");
    }
}

function createSpecies(newSpecies: Species) {
}

function updateSpeciesById(id: number, updateSpecies: Species) {
}

function deleteSpeciesById(id: number) {
}

export default
{
    getAllSpecies,
    getSpeciesById,
    createSpecies,
    updateSpeciesById,
    deleteSpeciesById
};