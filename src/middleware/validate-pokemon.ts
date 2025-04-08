import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    speciesName: z.string
    ({
        required_error: "Field 'speciesName' is required.",
        invalid_type_error: "Species name must be a string.",
    })
        .trim()
        .min(1, "Species name must be between 1 and 12 characters.")
        .max(12, "Species name must be between 1 and 12 characters.")
        .nonempty("Field 'speciesName' cannot be empty."),

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
});

function validatePokemonBody(req: Request, res: Response, next: NextFunction)
{
    try
    {
        const result = validationSchema.parse(req.body);

        req.body.speciesName = result.speciesName;
        req.body.teamId = result.teamId;
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

export default validatePokemonBody;
