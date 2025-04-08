import typeService from "../services/type-service";
import { Request, Response } from "express";
import { TypeBody } from "../models/type";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const types = await typeService.find();
        res.json(types);
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
        const type = await typeService.getById(id);

        if (!type) res.status(404).json({ error: "Type not found." });
        else res.json(type);
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
        const newType = new TypeBody(req.body);
        const insertedType = await typeService.create(newType);
        res.status(200).json(insertedType);
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
        const newType = new TypeBody(req.body);
        const updatedType = await typeService.update(id, newType);

        if (!updatedType) res.status(404).json({ error: "Type not found." });
        else res.status(200).json(updatedType);
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
        const result = await typeService.delete(id);

        if (!result) res.status(404).json({ error: "Type not found." });
        else res.json(`Type ${id} deleted.`);
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
