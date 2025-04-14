import { Validator } from "./validator";
import { z } from "zod";

class FormValidator extends Validator
{
    protected validationSchema = z.object
    ({
        name: z.string({ required_error: "Field 'name' is required.", invalid_type_error: "Name must be a string." })
            .trim()
            .min(1, "Name is required.")
            .max(12, "Name must be shorter than 12 characters."),

        species: z.string({ required_error: "Field 'species' is required.", invalid_type_error: "Species must be a string." })
            .trim()
            .min(1, "Species is required.")
            .max(12, "Species must be shorter than 12 characters."),

        types: z.array(
            z.string({ invalid_type_error: "Type must be a string." })
                .trim()
                .min(1, "Type is required.")
                .max(12, "Each type must be shorter than 12 characters."),
            { required_error: "Field 'types' is required.", invalid_type_error: "Types must be an array of strings." }
        )
            .max(2, "Form can have a maximum of two types.")
            .nonempty("Form must have at least one type.")
            .optional(),

        genderRatioId: z.number({ required_error: "Field 'genderRatioId' is required.", invalid_type_error: "Gender ratio ID name must be a positive integer." })
            .int("Gender ratio ID must be a positive integer.")
            .positive("Gender ratio ID must be a positive integer.")
            .optional(),

        height: z.number({ required_error: "Field 'height' is required.", invalid_type_error: "Height must be a number." })
            .min(0.1, "Height must be between 0.1 and 999.9 metres.")
            .max(999.9, "Height must be between 0.1 and 999.9 metres.")
            .refine(n => Number(n.toFixed(1)) === n, "Height must have at most one decimal place.")
            .optional(),

        weight: z.number({ required_error: "Field 'weight' is required.", invalid_type_error: "Weight must be a number." })
            .min(0.1, "Weight must be between 0.1 and 999.9 kg.")
            .max(999.9, "Weight must be between 0.1 and 999.9 kg.")
            .refine(n => Number(n.toFixed(1)) === n, "Weight must have at most one decimal place.")
            .optional(),

        abilities: z.array(
            z.string({ invalid_type_error: "Ability must be a string." })
                .trim()
                .min(1, "Ability is required.")
                .max(32, "Each ability must be shorter than 32 characters."),
            { required_error: "Field 'abilities' is required.", invalid_type_error: "Abilities must be an array of strings." }
        )
            .max(2, "Form can have a maximum of two abilities.")
            .nonempty("Form must have at least one ability.")
            .optional(),

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
        )
            .optional(),

        learnset: z.array(
            z.string({ invalid_type_error: "Move must be a string." })
                .trim()
                .min(1, "Each move must be between 1 and 32 characters long.")
                .max(32, "Each move must be between 1 and 32 characters long."),
            { required_error: "Field 'learnset' is required.", invalid_type_error: "Learnset must be an array of strings." }
        )
            .nonempty("Form must have at least one move in its learnset.")
            .optional(),

        generationId: z.number
        ({
            required_error: "Field 'generationId' is required.",
            invalid_type_error: "Generation ID must be a number.",
        })
            .int("Generation ID must be a positive integer.")
            .positive("Generation ID must be a positive integer.")
            .optional(),

    });
}

export default new FormValidator();
