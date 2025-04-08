import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validationSchema = z.object
({
    name: z.string
    ({
        required_error: "Field 'name' is required.",
        invalid_type_error: "Trainer name must be a string.",
    })
        .trim()
        .min(1, "Trainer name must be between 1 and 24 characters.")
        .max(24, "Trainer name must be between 1 and 24 characters.")
        .regex(/[a-zA-Z]/, "Trainer name must contain at least one letter."),

    password: z.string
    ({
        required_error: "Field 'password' is required.",
        invalid_type_error: "Password must be a string.",
    })
        .trim()
        .min(6, "Password must be at least 6 characters long.")
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/, "Password must contain at least one letter, one number, and one special character."),
});

const loginSchema = z.object
({
    name: z.string
    ({
        required_error: "Field 'name' is required.",
        invalid_type_error: "Trainer name must be a string.",
    })
        .trim()
        .min(1, "Trainer name must be between 1 and 24 characters.")
        .max(24, "Trainer name must be between 1 and 24 characters."),

    password: z.string
    ({
        required_error: "Field 'password' is required.",
        invalid_type_error: "Password must be a string.",
    })
        .trim(),
});

function validateTrainerBody(req: Request, res: Response, next: NextFunction)
{
    try
    {
        const result = validationSchema.parse(req.body);

        req.body.name = result.name;
        req.body.password = result.password;

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

function validateTrainerLogin(req: Request, res: Response, next: NextFunction)
{
    try
    {
        const result = loginSchema.parse(req.body);

        req.body.name = result.name;
        req.body.password = result.password;

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

export { validateTrainerBody, validateTrainerLogin };
