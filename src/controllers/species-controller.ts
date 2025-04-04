import { Request, Response } from "express";
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
        console.error("Error in index controller:", error);
        res.status(500).send({ error: "Failed to fetch species." });
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
        console.error("Error fetching species:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}

function store(req: Request, res: Response)
{
    res.send("Store!");
}

function update(req: Request, res: Response)
{
    res.send("Update!");
}

function destroy(req: Request, res: Response)
{
    res.send("Destroy!");
}

export default
{
    index,
    show,
    store,
    update,
    destroy
};
