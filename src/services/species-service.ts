import typeService from "./type-service";
import { NameLookupService } from "./service";
import { Species, SpeciesBody } from "../models/species";
import { SpeciesAdapter } from "../adapters/species-adapter";

class SpeciesService extends NameLookupService<Species, SpeciesBody>
{
    protected adapter = new SpeciesAdapter();
    protected tableName = "species";
    protected idField = "species_id";
    protected searchField = "s.name";
    protected nameField = "s.name";

    protected baseSelectQuery = `
        SELECT 
            s.species_id, s.name, s.height, s.weight,
            t1.type_id AS type1_id, t1.name AS type1_name, 
            t2.type_id AS type2_id, t2.name AS type2_name,
            g.male_rate, g.female_rate
        FROM species s
        LEFT JOIN types t1 ON s.type_1_id = t1.type_id
        LEFT JOIN types t2 ON s.type_2_id = t2.type_id
        LEFT JOIN gender_ratios g ON s.gender_ratio_id = g.gender_ratio_id
    `;

    protected async processRequestBody(body: SpeciesBody): Promise<SpeciesBody>
    {
        const processed = { ...body };

        processed.type1Id = await typeService.getIdByName(body.typeNames[0]);
        processed.type2Id = body.typeNames[1] ? await typeService.getIdByName(body.typeNames[1]) : null;

        return processed;
    }
}

const speciesService = new SpeciesService();
export default speciesService;
