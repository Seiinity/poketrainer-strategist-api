import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validateTrainerBody(req: Request, res: Response, next: NextFunction)
{
    const { name } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 24 }))
    {
        res.status(400).json({ error: "Trainer name is required and must be between 1 and 24 characters." });
        return;
    }

    req.body.name = name.trim();

    next();
}

export default validateTrainerBody;