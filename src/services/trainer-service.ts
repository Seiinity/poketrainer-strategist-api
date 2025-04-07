import db from "../db/mysql";
import { ResultSetHeader } from "mysql2";
import { Trainer, TrainerBody } from "../models/trainer";
import { isErrorCode } from "../utils/error-handling";

/* CRUD methods. */

async function getAllTrainers(): Promise<Trainer[]>
{
    try
    {
        return await db.queryTyped<Trainer>("SELECT id, name FROM trainers");
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
        return await db.queryOne<Trainer>("SELECT id, name, password_hash AS passwordHash FROM trainers WHERE id = ?", [id]);
    }
    catch (error)
    {
        throw new Error(`Error fetching trainer with ID ${id}: ${(error as Error).message}`);
    }
}

async function createTrainer(newTrainer: TrainerBody): Promise<Trainer>
{
    try
    {
        const sql = "INSERT INTO trainers (name, password_hash) VALUES (?, ?)";
        const params = [newTrainer.name, newTrainer.password];

        const [result] = await db.query<ResultSetHeader>(sql, params);

        return {
            id: result.insertId,
            name: newTrainer.name,
        };
    }
    catch (error)
    {
        if (isErrorCode(error, "ER_DUP_ENTRY"))
        {
            throw new Error("Trainer with the specified name already exists.");
        }

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
        if (isErrorCode(error, "ER_DUP_ENTRY"))
        {
            throw new Error("Trainer with the specified name already exists.");
        }

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

async function getTrainerIdByName(name: string): Promise<number>
{
    try
    {
        const trainer = await db.queryOne<Trainer>("SELECT id FROM trainers WHERE LOWER(name) = LOWER(?)", [name]);
        return (!trainer || !trainer.id) ? Promise.reject(new Error(`Unknown trainer '${name}'`)) : trainer.id;
    }
    catch (error)
    {
        throw new Error(`Error fetching trainer ID for ${name}: ${(error as Error).message}`);
    }
}

export default
{
    getAllTrainers,
    getTrainerById,
    createTrainer,
    updateTrainerById,
    deleteTrainerById,

    getTrainerIdByName
}