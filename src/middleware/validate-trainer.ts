import { Request, Response, NextFunction } from "express";
import validator from "validator";

export function validateTrainerBody(req: Request, res: Response, next: NextFunction)
{
    const { name, password } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 24 }))
    {
        res.status(400).json({ error: "Trainer name is required and must be between 1 and 24 characters." });
        return;
    }

    if (!password || !validator.isLength(password.trim(), { min: 6 }))
    {
        res.status(400).json({ error: "Password must be at least 6 characters long." });
        return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password.trim()))
    {
        res.status(400).json({ error: "Password must contain at least one letter, one number, and one special character." });
        return;
    }

    req.body.name = name.trim();
    req.body.password = password.trim();

    next();
}

export function validateTrainerLogin(req: Request, res: Response, next: NextFunction)
{
    const { name, password } = req.body;

    if (!name || !validator.isLength(name.trim(), { min: 1, max: 24 }))
    {
        res.status(400).json({ error: "Trainer name is required and must be between 1 and 24 characters." });
        return;
    }

    req.body.password = password.trim();

    next();
}