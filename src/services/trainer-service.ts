import teamService from "./team-service";
import { Trainer, TrainerBody } from "../models/trainer";
import { NameLookupService } from "./service";
import { TrainerAdapter } from "../adapters/trainer-adapter";
import { RowDataPacket } from "mysql2";

class TrainerService extends NameLookupService<Trainer, TrainerBody>
{
    protected adapter = new TrainerAdapter();
    protected tableName = "trainers";
    protected tableAlias = "tr";
    protected idField = "trainer_id";
    protected searchField = "name";
    protected nameField = "name";
    protected baseSelectQuery = "SELECT * FROM trainers tr";

    protected async adaptToModel(row: RowDataPacket): Promise<Trainer>
    {
        row.teams = await teamService.getReferencesByTrainerId(row.trainer_id);
        return super.adaptToModel(row);
    }
}

export default new TrainerService();
