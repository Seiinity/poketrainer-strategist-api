import speciesService from "../services/species-service";
import { Request, Response } from "express";
import { SpeciesBody } from "../models/species";

async function index(req: Request, res: Response): Promise<void>
{
    try
    {
        const search = req.query.search as string | undefined;
        const species = await speciesService.find(search);
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
        const idName = req.params.idName;
        const species = !isNaN(Number(idName))
            ? await speciesService.getById(parseInt(idName))
            : await speciesService.getByName(idName);

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
        const insertedSpecies = await speciesService.create(newSpecies);
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
        const updatedSpecies = await speciesService.update(id, newSpecies);

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
        const result = await speciesService.delete(id);

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
    destroy,
};
