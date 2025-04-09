import speciesService from "../services/species-service";
import { Request, Response } from "express";
import { Species, SpeciesBody } from "../models/species";
import { NameLookupController } from "./controller";

class SpeciesController extends NameLookupController<Species, SpeciesBody>
{
    constructor()
    {
        super(speciesService, SpeciesBody);
    }

    index = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const search = req.query.search as string | undefined;
            const species = await speciesService.find(search);
            res.json(species);
        }
        catch (error)
        {
            this.handleError(res, error);
        }
    }
}

export default new SpeciesController();
