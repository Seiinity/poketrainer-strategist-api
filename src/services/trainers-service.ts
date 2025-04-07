import db from "../db/mysql";
import { ResultSetHeader } from "mysql2";
import { Trainer } from "../models/trainer";

/* CRUD methods. */

async function getAllTrainers(): Promise<Trainer[]>
{
    try
    {
        return await db.queryTyped<Trainer>("SELECT * FROM trainers");
    }
    catch (error)
    {
        throw new Error(`Error fetching trainers: ${(error as Error).message}`);
    }
}

async function getTrainerById(id: number): Promise<Trainer | null>
{
    try
    {
        return await db.queryOne<Trainer>("SELECT * FROM trainers WHERE id = ?", [id]);
    }
    catch (error)
    {
        throw new Error(`Error fetching trainer with ID ${id}: ${(error as Error).message}`);
    }
}

async function createTrainer(newTrainer: Trainer): Promise<Trainer>
{
    try
    {
        const sql = "INSERT INTO trainers (name) VALUES (?)";
        const params = [newTrainer.name];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            name: newTrainer.name,
        };
    }
    catch (error)
    {
        throw new Error(`Error creating trainer: ${(error as Error).message}`);
    }
}

async function updateTrainerById(id: number, newTrainer: Trainer): Promise<Trainer | null>
{
    try
    {
        const sql = "UPDATE trainers SET name = ? WHERE id = ?";
        const params = [newTrainer.name, id];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        if (result.affectedRows === 0) return null;

        return {
            id,
            name: newTrainer.name
        };
    }
    catch (error)
    {
        throw new Error(`Error updating trainer with ID ${id}: ${(error as Error).message}`);
    }
}

async function deleteTrainerById(id: number): Promise<boolean>
{
    try
    {
        const [result] = await db.query<ResultSetHeader>("DELETE FROM trainers WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    catch (error)
    {
        throw new Error(`Error deleting trainer by ID: ${(error as Error).message}`);
    }
}

/* Additional methods. */

async function getTrainerByName(name: string): Promise<Trainer | null>
{
    try
    {
        return await db.queryOne<Trainer>("SELECT * FROM trainers WHERE name = ?", [name]);
    }
    catch (error)
    {
        throw new Error(`Error fetching trainer with name ${name}: ${(error as Error).message}`);
    }
}

export default
{
    getAllTrainers,
    getTrainerById,
    createTrainer,
    updateTrainerById,
    deleteTrainerById,

    getTrainerByName
}