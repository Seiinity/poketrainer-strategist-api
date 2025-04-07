import { Request, Response } from "express";
import * as argon2 from "argon2";
import trainerService from "../services/trainer-service";
import { Trainer, TrainerBody } from "../models/trainer";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const trainers = await trainerService.getAllTrainers();
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
        const id = parseInt(req.params.id);
        const trainer = await trainerService.getTrainerById(id);

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
        const newTrainer: TrainerBody =
        {
            name: req.body.name,
            password: await argon2.hash(req.body.password, { type: argon2.argon2i }),
        };

        const insertedTrainer = await trainerService.createTrainer(newTrainer);
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
        const newTrainer: Trainer =
        {
            name: req.body.name,
        };

        const updatedTrainer = await trainerService.updateTrainerById(id, newTrainer);

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
        const result = await trainerService.deleteTrainerById(id);

        if (!result) res.status(404).json({ error: "Trainer not found." });
        else res.json(`Trainer ${id} deleted.`);
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
    destroy
};
