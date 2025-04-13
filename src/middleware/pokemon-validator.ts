import { z } from "zod";
import { Validator } from "./validator";

class PokemonValidator extends Validator
{
    protected validationSchema = z.object
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
            required_error: "Field 'nature' is required.",
            invalid_type_error: "Nature must be a string.",
        })
            .trim()
            .min(1, "Nature must not be empty.")
            .max(12, "Nature must be between 1 and 12 characters long."),

        heldItem: z.string
        ({
            required_error: "Field 'heldItem' is required.",
            invalid_type_error: "Held item must be a string.",
        })
            .trim()
            .min(1, "Held item not be empty.")
            .max(32, "Held item be between 1 and 32 characters long."),

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

        moves: z.array(
            z.string({ invalid_type_error: "Move must be a string." })
                .trim()
                .min(1, "Each move must be between 1 and 32 characters long.")
                .max(32, "Each move must be between 1 and 32 characters long."),
            { required_error: "Field 'moves' is required.", invalid_type_error: "Moves must be an array of strings." }
        )
            .nonempty("Pokémon must have at least one move."),
    });
}

export default new PokemonValidator();