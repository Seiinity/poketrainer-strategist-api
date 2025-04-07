import { Request, Response, NextFunction } from "express";

function validateId(req: Request, res: Response, next: NextFunction)
{
    const id = Number(req.params.id);

    if (id && Number.isInteger(id) && id > 0) next();
    else res.status(400).json({ error: "ID must be a positive integer." });
}

export default validateId;