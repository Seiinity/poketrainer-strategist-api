import { Validator } from "./validator";
import { z } from "zod";

class HeldItemValidator extends Validator
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
    });
}

export default new HeldItemValidator();
