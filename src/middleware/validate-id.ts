import { Request, Response, NextFunction } from "express";

export function validateId(req: Request, res: Response, next: NextFunction)
{
    req.params.id = req.params.id.trim();
    const id = Number(req.params.id);

    if (id && Number.isInteger(id) && id > 0) next();
    else res.status(400).json({ error: "ID must be a positive integer." });
}

export function sanitiseIdOrName(req: Request, _res: Response, next: NextFunction)
{
    req.params.idName = req.params.idName.trim();
    next();
}
