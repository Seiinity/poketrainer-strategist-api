import { Request, Response } from "express";
import { SpeciesBody } from "../models/species";
import speciesService from "../services/species-service";

async function index(req: Request, res: Response): Promise<void>
{
    try
    {
        const search = req.query.search as string | undefined;
        const species = await speciesService.getAllSpecies(search);
        res.json(species);
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
        const species = await speciesService.getSpeciesById(id);

        if (!species) res.status(404).json({ error: "Species not found." });
        else res.json(species);
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
        const newSpecies = new SpeciesBody(req.body);
        const insertedSpecies = await speciesService.createSpecies(newSpecies);
        res.status(200).json(insertedSpecies);
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
        const newSpecies = new SpeciesBody(req.body);
        const updatedSpecies = await speciesService.updateSpeciesById(id, newSpecies);

        if (!updatedSpecies) res.status(404).json({ error: "Species not found." });
        else res.status(200).json(updatedSpecies);
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
        const result = await speciesService.deleteSpeciesById(id);

        if (!result) res.status(404).json({ error: "Species not found." });
        else res.json(`Species ${id} deleted.`);
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
