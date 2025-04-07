import { Request, Response } from "express";
import { Trainer } from "../models/trainer";
import trainerService from "../services/trainer-service";

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
        const newTrainer: Trainer =
        {
            name: req.body.name,
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
