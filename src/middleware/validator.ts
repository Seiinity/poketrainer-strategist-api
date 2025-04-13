import { z, ZodObject, ZodRawShape } from "zod";
import { NextFunction, Request, Response } from "express";

export abstract class Validator
{
    protected abstract validationSchema: ZodObject<ZodRawShape>;

    private validate = (req: Request, res: Response, next: NextFunction, schema: z.Schema): void =>
    {
        try
        {
            req.body = schema.parse(req.body);
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
    };

    validateRequired = (req: Request, res: Response, next: NextFunction): void =>
    {
        this.validate(req, res, next, this.validationSchema);
    };

    validateOptional = (req: Request, res: Response, next: NextFunction): void =>
    {
        this.validate(req, res, next, this.validationSchema.partial());
    };
}
