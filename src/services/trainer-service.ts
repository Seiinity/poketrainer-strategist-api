import teamService from "./team-service";
import trainerAdapter from "../adapters/trainer-adapter";
import { Trainer, TrainerBody } from "../models/trainer";
import { NameLookupService } from "./service";
import { RowDataPacket } from "mysql2";

class TrainerService extends NameLookupService<Trainer, TrainerBody>
{
    protected adapter = trainerAdapter;
    protected tableName = "trainers";
    protected tableAlias = "tr";
    protected idField = "trainer_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = "SELECT * FROM trainers tr";

    protected override async adaptToModel(row: RowDataPacket): Promise<Trainer>
    {
        row.teams = await teamService.getByTrainerId(row.trainer_id);
        return super.adaptToModel(row);
    }
}

export default new TrainerService();
