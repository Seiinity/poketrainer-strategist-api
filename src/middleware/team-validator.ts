import { z } from "zod";
import { Validator } from "./validator";

class TeamValidator extends Validator
{
    protected validationSchema = z.object
    ({
        name: z.string({ required_error: "Field 'name' is required.", invalid_type_error: "Team name must be a string." })
            .trim()
            .min(1, "Team name is required.")
            .max(24, "Team name must be shorter than 24 characters."),

        trainerName: z.string({ required_error: "Field 'trainerName' is required.", invalid_type_error: "Trainer name must be a string." })
            .trim()
            .min(1, "Trainer name is required.")
            .max(12, "Trainer name must be shorter than 12 characters."),
    });
}

export default new TeamValidator();
