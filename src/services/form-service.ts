import { Service } from "./service";
import { Form, FormBody } from "../models/form";
import formAdapter from "../adapters/form-adapter";
import { RowDataPacket } from "mysql2";
import { Species } from "../models/species";
import abilityService from "./ability-service";
import statService from "./stat-service";
import moveService from "./move-service";

class FormService extends Service<Form, FormBody>
{
    protected adapter = formAdapter;
    protected tableName = "forms";
    protected tableAlias = "fm";
    protected idField = "form_id";
    protected searchField = "name";

    protected baseSelectQuery = `
        SELECT
            fm.form_id,
            fm.species_id,
            fm.name,
            COALESCE(fm.type_1_id, sp.type_1_id) AS type_1_id,
            IF(fm.explicit_type_2 = true AND fm.type_2_id IS NULL, NULL, COALESCE(fm.type_2_id, sp.type_2_id)) AS type_2_id,
            tp1.name AS type_1_name,
            tp2.name AS type_2_name,
            COALESCE(fm.gender_ratio_id, sp.gender_ratio_id) AS gender_ratio_id,
            COALESCE(fm.height, sp.height) AS height,
            COALESCE(fm.weight, sp.weight) AS weight,
            COALESCE(fm.generation_id, sp.generation_id) AS generation_id,
            gr.male_rate,
            gr.female_rate,
            gn.name AS generation,
            sp.name AS species_name
        FROM forms fm
        JOIN species sp ON fm.species_id = sp.species_id
        LEFT JOIN types tp1 ON COALESCE(fm.type_1_id, sp.type_1_id) = tp1.type_id
        LEFT JOIN types tp2 ON IF(fm.explicit_type_2 = true AND fm.type_2_id IS NULL, NULL, COALESCE(fm.type_2_id, sp.type_2_id)) = tp2.type_id
        LEFT JOIN gender_ratios gr ON COALESCE(fm.gender_ratio_id, sp.gender_ratio_id) = gr.gender_ratio_id
        LEFT JOIN generations gn ON COALESCE(fm.generation_id, sp.generation_id) = gn.generation_id
    `;

    protected override async adaptToModel(row: RowDataPacket): Promise<Form>
    {
        row.abilities = await abilityService.getBySpeciesId(row.species_id);
        row.base_stats = await statService.getBySpeciesId(row.species_id);
        row.learnset = await moveService.getBySpeciesId(row.species_id);
        return super.adaptToModel(row);
    }
}

export default new FormService();
