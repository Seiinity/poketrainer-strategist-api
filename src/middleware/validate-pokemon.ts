import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    species: z.string
    ({
        required_error: "Field 'species' is required.",
        invalid_type_error: "Species name must be a string.",
    })
        .trim()
        .min(1, "Species name cannot be empty.")
        .max(12, "Species name must be shorter than 12 characters."),

    level: z.number
    ({
        required_error: "Field 'level' is required.",
        invalid_type_error: "Level must be a number.",
    })
        .int("Level must be a positive integer.")
        .positive("Level must be a positive integer.")
        .max(100, "Level must be no higher than 100."),

    gender: z.string
    ({
        required_error: "Field 'gender' is required.",
        invalid_type_error: "Gender must be a string.",
    })
        .trim(),

    ability: z.string
    ({
        required_error: "Field 'ability' is required.",
        invalid_type_error: "Ability name must be a string.",
    })
        .trim()
        .min(1, "Ability name cannot be empty.")
        .max(12, "Ability name must be shorter than 12 characters."),

    teamId: z.number
    ({
        required_error: "Field 'teamId' is required.",
        invalid_type_error: "Team ID must be a number.",
    })
        .int("Team ID must be a positive integer.")
        .positive("Team ID must be a positive integer."),

    nickname: z.string
    ({
        invalid_type_error: "Nickname must be a string.",
    })
        .trim()
        .min(1, "Nickname must be between 1 and 12 characters.")
        .max(12, "Nickname must be between 1 and 12 characters.")
        .optional(),

    nature: z.string
    ({
        invalid_type_error: "Nature must be a string.",
    })
        .trim()
        .min(1, "Nature must not be empty.")
        .max(12, "Nature must be between 1 and 12 characters."),

    evs: z.array(
        z.number({ invalid_type_error: "EV value must be a number." })
            .int("EV value must be a positive integer.")
            .min(0, "EV value must be at least 0.")
            .max(252, "EV value must not be higher than 252."),
        { required_error: "Field 'evs' is required.", invalid_type_error: "EVs must be an array of numbers." }
    ).refine(values => values.reduce((sum, value) => sum + value, 0) <= 510, {
        message: "Total EVs must not exceed 510."
    }),

    ivs: z.array(
        z.number({ invalid_type_error: "IV value must be a number." })
            .int("IV value must be a positive integer.")
            .min(0, "IV value must be at least 0."),
        { required_error: "Field 'ivs' is required.", invalid_type_error: "IVs must be an array of numbers." }
    ),
});

function validatePokemonBody(req: Request, res: Response, next: NextFunction, schema: z.Schema)
{
    try
    {
        const result = schema.parse(req.body);

        req.body.speciesName = result.speciesName;
        req.body.teamId = result.teamId;
        req.body.gender = result.gender;
        req.body.ability = result.ability;
        if (result.nickname) req.body.nickname = result.nickname;

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

export function validatePokemonBodyRequired(req: Request, res: Response, next: NextFunction)
{
    validatePokemonBody(req, res, next, validationSchema);
}

export function validatePokemonBodyOptional(req: Request, res: Response, next: NextFunction)
{
    validatePokemonBody(req, res, next, validationSchema.partial());
}
