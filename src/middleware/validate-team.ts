import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validateTeamBody(req: Request, res: Response, next: NextFunction)
{
    const { name, trainerName } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 24 }))
    {
        res.status(400).json({ error: "Team name is required and must be between 1 and 24 characters." });
        return;
    }

    if (!trainerName || !validator.isLength(trainerName.trim(), { min: 1, max: 12 }))
    {
        res.status(400).json({ error: "Trainer name is required and must be between 1 and 24 characters." });
        return;
    }

    req.body.name = name.trim();
    req.body.trainerName = trainerName.trim();

    next();
}

export default validateTeamBody;