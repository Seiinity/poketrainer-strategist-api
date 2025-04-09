import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string({ required_error: "Field 'name' is required.", invalid_type_error: "Species name must be a string." })
        .trim()
        .min(1, "Species name is required.")
        .max(12, "Species name must be shorter than 12 characters."),

    typeNames: z.array(
        z.string({ invalid_type_error: "Type name must be a string." })
            .trim()
            .min(1, "Type name is required.")
            .max(12, "Each type name must be shorter than 12 characters."),
        { required_error: "Field 'typeNames' is required.", invalid_type_error: "Type names must be an array of strings." }
    )
        .max(2, "Species can have a maximum of two types.")
        .nonempty("Species must have at least one type."),

    genderRatioId: z.number({ required_error: "Field 'genderRatioId' is required.", invalid_type_error: "Gender ratio ID name must be a positive integer." })
        .int("Gender ratio ID must be a positive integer.")
        .positive("Gender ratio ID must be a positive integer."),

    height: z.number({ required_error: "Field 'height' is required.", invalid_type_error: "Height name must be a number." })
        .min(0.1, "Height must be between 0.1 and 999.9 metres.")
        .max(999.9, "Height must be between 0.1 and 999.9 metres.")
        .refine(n => Number(n.toFixed(1)) === n, "Height must have at most one decimal place."),

    weight: z.number({ required_error: "Field 'weight' is required.", invalid_type_error: "Weight must be a number." })
        .min(0.1, "Weight must be between 0.1 and 999.9 kg.")
        .max(999.9, "Weight must be between 0.1 and 999.9 kg.")
        .refine(n => Number(n.toFixed(1)) === n, "Weight must have at most one decimal place."),

});

function validateSpeciesBody(req: Request, res: Response, next: NextFunction)
{
    try
    {
        const result = validationSchema.parse(req.body);

        req.body.name = result.name;
        req.body.typeNames = result.typeNames;

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

export default validateSpeciesBody;
