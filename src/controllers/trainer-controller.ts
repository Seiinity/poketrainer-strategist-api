import trainerService from "../services/trainer-service";
import * as argon2 from "argon2";
import { Request, Response } from "express";
import { TrainerBody } from "../models/trainer";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const trainers = await trainerService.find();
        res.json(trainers);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function show(req: Request, res: Response): Promise<void>
{
    try
    {
        const idName = req.params.idName;
        const trainer = !isNaN(Number(idName))
            ? await trainerService.getById(parseInt(idName))
            : await trainerService.getByName(idName);

        if (!trainer) res.status(404).json({ error: "Trainer not found." });
        else res.json(trainer);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function store(req: Request, res: Response): Promise<void>
{
    try
    {
        const passwordHash = await argon2.hash(req.body.password, { type: argon2.argon2i });
        const newTrainer = new TrainerBody(req.body, passwordHash);
        const insertedTrainer = await trainerService.create(newTrainer);
        res.status(200).json(insertedTrainer);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function update(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = parseInt(req.params.id);
        const newTrainer = new TrainerBody(req.body);
        const updatedTrainer = await trainerService.update(id, newTrainer);

        if (!updatedTrainer) res.status(404).json({ error: "Trainer not found." });
        else res.status(200).json(updatedTrainer);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function destroy(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = parseInt(req.params.id);
        const result = await trainerService.delete(id);

        if (!result) res.status(404).json({ error: "Trainer not found." });
        else res.json(`Trainer ${id} deleted.`);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function login(req: Request, res: Response)
{
    try
    {
        const newTrainer = new TrainerBody(req.body);

        const trainer = await trainerService.getByName(newTrainer.name);

        if (!trainer)
        {
            res.status(404).json({ error: "Trainer not found." });
            return;
        }

        if (!trainer.passwordHash)
        {
            res.status(404).json({ error: "Invalid password in server." });
            return;
        }

        if (!await argon2.verify(trainer.passwordHash, newTrainer.password as string))
        {
            res.status(401).json({ error: "Wrong password." });
            return;
        }

        res.status(200).json({ message: `Welcome, ${trainer.name}!` });
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

export default
{
    index,
    show,
    store,
    update,
    destroy,
    login,
};
