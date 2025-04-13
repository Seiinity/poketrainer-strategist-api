import { z } from "zod";
import { Validator } from "./validator";

class AbilityValidator extends Validator
{
    protected validationSchema = z.object
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
}

export default new AbilityValidator();