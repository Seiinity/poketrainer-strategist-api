import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import teamService from "../services/team-service";

export function authenticateTrainer(req: Request, res: Response, next: NextFunction)
{
    const rawToken = req.header("Authorization");
    if (!rawToken)
    {
        res.status(401).json({ error: "Unauthorised." });
        return;
    }

    const token = rawToken!.split(" ")[1];

    try
    {
        const decoded = jwt.verify(token, config.jwtSecret, {});
        res.locals.trainer = decoded.sub;
    }
    catch
    {
        res.status(401).json({ error: "Unauthorised." });
        return;
    }

    next();
}

export async function authenticateTeamOwner(req: Request, res: Response, next: NextFunction)
{
    const teamId = Number(req.params.id);
    const trainerName = res.locals.trainer;

    const isAuthorised = await teamService.isAuthorised(teamId, trainerName);

    if (!isAuthorised)
    {
        res.status(401).json({ error: "Unauthorised." });
        return;
    }

    next();
}