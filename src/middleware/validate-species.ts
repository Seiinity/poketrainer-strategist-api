import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validateSpeciesBody(req: Request, res: Response, next: NextFunction)
{
    const { name, types } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 12 }))
    {
        res.status(400).json({ error: "Species name is required and must be between 1 and 12 characters." });
        return;
    }

    if (!Array.isArray(types) || types.length === 0 || types.length > 2)
    {
        res.status(400).json({ error: "Species must have one or two types." });
        return;
    }

    for (const typeName of types)
    {
        if (typeof typeName !== "string" || !validator.isLength(typeName.trim(), { min: 1, max: 12 }))
        {
            res.status(400).json({ error: "Each type name must be a string between 1 and 12 characters." });
            return;
        }
    }

    req.body.name = name.trim();
    req.body.types = types.map((typeName: string) => typeName.trim());

    next();
}

export default validateSpeciesBody;