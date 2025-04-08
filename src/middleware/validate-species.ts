import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validateSpeciesBody(req: Request, res: Response, next: NextFunction)
{
    const { name, typeNames, genderRatioId } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 12 }))
    {
        res.status(400).json({ error: "Species name is required and must be between 1 and 12 characters." });
        return;
    }

    if (!Array.isArray(typeNames) || typeNames.length === 0 || typeNames.length > 2)
    {
        res.status(400).json({ error: "Species must have one or two types." });
        return;
    }

    for (const typeName of typeNames)
    {
        if (typeof typeName !== "string" || !validator.isLength(typeName.trim(), { min: 1, max: 12 }))
        {
            res.status(400).json({ error: "Each type name must be a string between 1 and 12 characters." });
            return;
        }
    }

    if (!genderRatioId || !Number.isInteger(Number(genderRatioId)) || Number(genderRatioId) <= 0)
    {
        res.status(400).json({ error: "Gender ratio ID must be a positive integer." });
        return;
    }

    req.body.name = name.trim();
    req.body.types = typeNames.map((typeName: string) => typeName.trim());

    next();
}

export default validateSpeciesBody;