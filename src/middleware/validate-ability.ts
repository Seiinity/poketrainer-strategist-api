import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string
    ({
        required_error: "Field 'name' is required.",
        invalid_type_error: "Ability name must be a string.",
    })
        .trim()
        .min(1, "Ability name cannot be empty.")
        .max(32, "Ability name must be shorter than 32 characters."),

    description: z.string
    ({
        required_error: "Field 'description' is required.",
        invalid_type_error: "Ability description must be a string.",
    })
        .trim()
        .min(1, "Ability description cannot be empty.")
        .max(255, "Ability description must be shorter than 255 characters."),

    generationId: z.number
    ({
        required_error: "Field 'generationId' is required.",
        invalid_type_error: "Generation ID must be a number.",
    })
        .int("Generation ID must be a positive integer.")
        .positive("Generation ID must be a positive integer."),
});

function validateAbilityBody(req: Request, res: Response, next: NextFunction, schema: z.Schema)
{
    try
    {
        const result = schema.parse(req.body);

        req.body.name = result.name;
        req.body.description = result.description;

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

export function validateAbilityBodyRequired(req: Request, res: Response, next: NextFunction)
{
    validateAbilityBody(req, res, next, validationSchema);
}

export function validateAbilityBodyOptional(req: Request, res: Response, next: NextFunction)
{
    validateAbilityBody(req, res, next, validationSchema.partial());
}
