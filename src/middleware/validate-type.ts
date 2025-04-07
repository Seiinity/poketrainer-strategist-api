import { Request, Response, NextFunction } from "express";
import validator from "validator";

function validateTypeBody(req: Request, res: Response, next: NextFunction)
{
    const { name } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 12 }))
    {
        res.status(400).json({ error: "Type name is required and must be between 1 and 12 characters." });
        return;
    }

    req.body.name = name.trim();

    next();
}

export default validateTypeBody;