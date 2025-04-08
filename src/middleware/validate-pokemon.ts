import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validatePokemonBody(req: Request, res: Response, next: NextFunction)
{
    const { speciesName, trainerId } = req.body;

    if (!speciesName || !validator.isLength(speciesName.trim(), { min: 1, max: 12 }))
    {
        res.status(400).json({ error: "Species name is required and must be between 1 and 24 characters." });
        return;
    }

    if (!trainerId || !Number.isInteger(Number(trainerId) || Number(trainerId) <= 0))
    {
        res.status(400).json({ error: "Trainer ID must be a positive integer." });
        return;
    }

    req.body.name = speciesName.trim();

    next();
}

export default validatePokemonBody;