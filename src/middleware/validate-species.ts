import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    id: z.number({ required_error: "Field 'id' is required.", invalid_type_error: "ID must be a number." })
        .int("ID must be a positive integer.")
        .positive("ID must be a positive integer."),

    name: z.string({ required_error: "Field 'name' is required.", invalid_type_error: "Species name must be a string." })
        .trim()
        .min(1, "Species name is required.")
        .max(12, "Species name must be shorter than 12 characters."),

    types: z.array(
        z.string({ invalid_type_error: "Type must be a string." })
            .trim()
            .min(1, "Type is required.")
            .max(12, "Each type must be shorter than 12 characters."),
        { required_error: "Field 'types' is required.", invalid_type_error: "Types must be an array of strings." }
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

    abilities: z.array(
        z.string({ invalid_type_error: "Ability must be a string." })
            .trim()
            .min(1, "Ability is required.")
            .max(32, "Each ability must be shorter than 32 characters."),
        { required_error: "Field 'abilities' is required.", invalid_type_error: "Abilities must be an array of strings." }
    )
        .max(2, "Species can have a maximum of two abilities.")
        .nonempty("Species must have at least one ability."),

    hiddenAbility: z.string({ invalid_type_error: "Hidden Ability must be a string." })
        .trim()
        .min(1, "Hidden Ability must be between 1 and 32 characters long.")
        .max(32, "Hidden Ability must be between 1 and 32 characters long.")
        .optional(),

    baseStats: z.array(
        z.number({ invalid_type_error: "Base stat value must be a number." })
            .int("Base stat value must be a positive integer.")
            .positive("Base stat value must be a positive integer."),
        { required_error: "Field 'baseStats' is required.", invalid_type_error: "Base stats must be an array of numbers." }
    ),

    learnset: z.array(
        z.string({ invalid_type_error: "Move must be a string." })
            .trim()
            .min(1, "Each move must be between 1 and 32 characters long.")
            .max(32, "Each move must be between 1 and 32 characters long."),
        { required_error: "Field 'learnset' is required.", invalid_type_error: "Learnset must be an array of strings." }
    )
        .nonempty("Species must have at least one move in its learnset."),

    generationId: z.number
    ({
        required_error: "Field 'generationId' is required.",
        invalid_type_error: "Generation ID must be a number.",
    })
        .int("Generation ID must be a positive integer.")
        .positive("Generation ID must be a positive integer."),

});

function validateSpeciesBody(req: Request, res: Response, next: NextFunction, schema: z.Schema)
{
    try
    {
        const result = schema.parse(req.body);

        req.body.name = result.name;
        req.body.types = result.types;
        req.body.abilities = result.abilities;
        req.body.learnset = result.learnset;

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

export function validateSpeciesBodyRequired(req: Request, res: Response, next: NextFunction)
{
    validateSpeciesBody(req, res, next, validationSchema);
}

export function validateSpeciesBodyOptional(req: Request, res: Response, next: NextFunction)
{
    validateSpeciesBody(req, res, next, validationSchema.partial());
}
