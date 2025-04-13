import { z } from "zod";
import { Validator } from "./validator";

class TypeValidator extends Validator
{
    protected validationSchema = z.object
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
}

export default new TypeValidator();
