import { Validator } from "./validator";
import { z } from "zod";

class MoveValidator extends Validator
{
    protected validationSchema = z.object
    ({
        name: z.string
        ({
            required_error: "Field 'name' is required.",
            invalid_type_error: "Name must be a string.",
        })
            .trim()
            .min(1, "Name cannot be empty.")
            .max(32, "Name must be shorter than 32 characters."),

        description: z.string
        ({
            required_error: "Field 'description' is required.",
            invalid_type_error: "Description must be a string.",
        })
            .trim()
            .min(1, "Description cannot be empty.")
            .max(255, "Description must be shorter than 255 characters."),

        type: z.string
        ({
            required_error: "Field 'type' is required.",
            invalid_type_error: "Type must be a string.",
        })
            .trim()
            .min(1, "Type cannot be empty.")
            .max(12, "Type must be shorter than 12 characters."),

        category: z.string
        ({
            required_error: "Field 'category' is required.",
            invalid_type_error: "Category must be a string.",
        })
            .trim()
            .min(1, "Category cannot be empty.")
            .max(12, "Category must be shorter than 12 characters."),

        pp: z.number
        ({
            required_error: "Field 'pp' is required.",
            invalid_type_error: "PP must be a number.",
        })
            .int("PP must be a positive integer.")
            .positive("PP must be a positive integer."),

        generation: z.number
        ({
            required_error: "Field 'generation' is required.",
            invalid_type_error: "Generation must be a number.",
        })
            .int("Generation must be a positive integer.")
            .positive("Generation must be a positive integer."),

        power: z.number
        ({
            invalid_type_error: "Power must be a number.",
        })
            .int("Power must be a positive integer.")
            .positive("Power must be a positive integer.")
            .optional(),

        accuracy: z.number
        ({
            invalid_type_error: "Accuracy must be a number.",
        })
            .min(0.01, "Accuracy must be between 0.01 and 1.00.")
            .max(1.00, "Accuracy must be between 0.01 and 1.00.")
            .refine(n => Number(n.toFixed(2)) === n, "Accuracy must have at most two decimal places.")
            .optional(),
    });
}

export default new MoveValidator();
