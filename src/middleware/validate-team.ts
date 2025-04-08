import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string({ required_error: "Team name is required.", invalid_type_error: "Team name must be a string." })
        .trim()
        .min(1, "Team name must be between 1 and 24 characters.")
        .max(24, "Team name must be between 1 and 24 characters.")
        .nonempty("Team name is required."),

    trainerName: z.string({ required_error: "Trainer name is required.", invalid_type_error: "Trainer name must be a string." })
        .trim()
        .min(1, "Trainer name must be between 1 and 12 characters.")
        .max(12, "Trainer name must be between 1 and 12 characters.")
        .nonempty("Trainer name is required.")
});

function validateTeamBody(req: Request, res: Response, next: NextFunction)
{
    try
    {
        const result = validationSchema.parse(req.body);

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

export default validateTeamBody;