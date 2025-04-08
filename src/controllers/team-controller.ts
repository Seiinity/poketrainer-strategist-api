import { Request, Response } from "express";
import { TeamBody } from "../models/team";
import teamService from "../services/team-service";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const teams = await teamService.find();
        res.json(teams);
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
        const team = await teamService.getById(id);

        if (!team) res.status(404).json({ error: "Team not found." });
        else res.json(team);
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
        const newTeam = new TeamBody(req.body);
        const insertedTeam = await teamService.create(newTeam);
        res.status(200).json(insertedTeam);
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
        const newTeam = new TeamBody(req.body);
        const updatedTeam = await teamService.update(id, newTeam);

        if (!updatedTeam) res.status(404).json({ error: "Team not found." });
        else res.status(200).json(updatedTeam);
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
        const result = await teamService.delete(id);

        if (!result) res.status(404).json({ error: "Team not found." });
        else res.json(`Team ${id} deleted.`);
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
