import trainerService from "../services/trainer-service";
import * as argon2 from "argon2";
import { Request, Response } from "express";
import { NameLookupController } from "./controller";
import { Trainer, TrainerBody } from "../models/trainer";

class TrainerController extends NameLookupController<Trainer, TrainerBody>
{
    constructor()
    {
        super(trainerService, TrainerBody);
    }

    store = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const passwordHash = await argon2.hash(req.body.password, { type: argon2.argon2i });
            const newTrainer = new TrainerBody(req.body, passwordHash);
            const insertedTrainer = await trainerService.create(newTrainer);
            res.status(200).json(insertedTrainer);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };

    login = async (req: Request, res: Response) =>
    {
        try
        {
            const newTrainer = new TrainerBody(req.body);

            const trainer = await trainerService.nameLookup.getByName(newTrainer.name as string);

            if (!trainer)
            {
                res.status(404).json({ error: "Trainer not found." });
                return;
            }

            if (!trainer.passwordHash)
            {
                res.status(404).json({ error: "Invalid password in server." });
                return;
            }

            if (!await argon2.verify(trainer.passwordHash, newTrainer.password as string))
            {
                res.status(401).json({ error: "Wrong password." });
                return;
            }

            res.status(200).json({ message: `Welcome, ${trainer.name}!` });
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    };
}

export default new TrainerController();
