import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string({ required_error: "Field 'name' is required.", invalid_type_error: "Team name must be a string." })
        .trim()
        .min(1, "Team name is required.")
        .max(24, "Team name must be shorter than 24 characters."),

    trainerName: z.string({ required_error: "Field 'trainerName' is required.", invalid_type_error: "Trainer name must be a string." })
        .trim()
        .min(1, "Trainer name is required.")
        .max(12, "Trainer name must be shorter than 12 characters."),
});

function validateTeamBody(req: Request, res: Response, next: NextFunction, schema: z.Schema)
{
    try
    {
        const result = schema.parse(req.body);

        req.body.name = result.name;
        req.body.trainerName = result.trainerName;

        next();
    }
    catch (error)
    {
        if (error instanceof z.ZodError)
        {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ error: errorMessages });
            return;
        }

        res.status(500).json({ error: "An unexpected error occurred during validation." });
    }
}

export function validateTeamBodyRequired(req: Request, res: Response, next: NextFunction)
{
    validateTeamBody(req, res, next, validationSchema);
}

export function validateTeamBodyOptional(req: Request, res: Response, next: NextFunction)
{
    validateTeamBody(req, res, next, validationSchema.partial());
}
