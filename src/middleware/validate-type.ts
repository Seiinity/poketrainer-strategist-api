import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string
    ({
        required_error: "Field 'name' is required.",
        invalid_type_error: "Type name must be a string.",
    })
        .trim()
        .min(1, "Type name is required.")
        .max(12, "Type name must be shorter than 12 characters."),

    weakTo: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'weakTo' must be an array of strings." }
    )
        .optional(),

    resistantTo: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'resistantTo' must be an array of strings." }
    )
        .optional(),

    immuneTo: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'immuneTo' must be an array of strings." }
    )
        .optional(),

    weakAgainst: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'weakAgainst' must be an array of strings." }
    )
        .optional(),

    strongAgainst: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'strongAgainst' must be an array of strings." }
    )
        .optional(),

    ineffectiveAgainst: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { invalid_type_error: "If included, 'ineffectiveAgainst' must be an array of strings." }
    )
        .optional(),

});

function validateTypeBody(req: Request, res: Response, next: NextFunction, schema: z.Schema)
{
    try
    {
        const result = schema.parse(req.body);

        req.body.name = result.name;
        req.body.weakTo = result.weakTo;
        req.body.resistantTo = result.resistantTo;
        req.body.immuneTo = result.immuneTo;
        req.body.weakAgainst = result.weakAgainst;
        req.body.strongAgainst = result.strongAgainst;
        req.body.ineffectiveAgainst = result.ineffectiveAgainst;

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

export function validateTypeBodyRequired(req: Request, res: Response, next: NextFunction)
{
    validateTypeBody(req, res, next, validationSchema);
}

export function validateTypeBodyOptional(req: Request, res: Response, next: NextFunction)
{
    validateTypeBody(req, res, next, validationSchema.partial());
}
