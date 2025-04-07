import { Request, Response } from "express";
import { Species } from "../models/species";
import speciesService from "../services/species-service";

async function index(req: Request, res: Response)
{
    try
    {
        const species = await speciesService.getAllSpecies();
        res.json(species);
    }
    catch (error)
    {
        console.error(`Error fetching species: ${error}`);
        res.status(500).send({ error: "Something went wrong." });
    }
}

async function show(req: Request, res: Response)
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
        console.error(`Error fetching species: ${error}`);
        res.status(500).json({ error: "Something went wrong." });
    }
}

async function store(req: Request, res: Response)
{
    try
    {
        const newSpecies: Species =
        {
            name: req.body.name,
        };

        const insertedSpecies = await speciesService.createSpecies(newSpecies);
        res.status(200).json(insertedSpecies);
    }
    catch (error)
    {
        console.error(`Error creating species: ${error}`);
        res.status(500).json({ error: "Something went wrong." });
    }
}

function update(req: Request, res: Response)
{
    res.send("Update!");
}

async function destroy(req: Request, res: Response)
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
        console.error(`Error deleting species: ${error}`);
        res.status(500).json({ error: "Something went wrong." });
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
