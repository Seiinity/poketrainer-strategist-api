import { Trainer, TrainerBody } from "../models/trainer";
import { Service } from "./service";
import { TrainerAdapter } from "../adapters/trainer-adapter";
import db from "../db/mysql";
import { RowDataPacket } from "mysql2";

class TrainerService extends Service<Trainer, TrainerBody>
{
    protected adapter = new TrainerAdapter();
    protected tableName = "trainers";
    protected idField = "trainer_id";
    protected searchField = "name";
    protected baseSelectQuery = "SELECT * FROM trainers";

    async getByName(name: string) : Promise<Trainer | null>
    {
        try
        {
            const query = `${this.baseSelectQuery} WHERE name = ?`;
            const row = await db.queryOne<RowDataPacket>(query, [name]);
            return row ? this.adapter.fromMySQL(row) : null;
        }
        catch (error)
        {
            throw new Error(`Error fetching ${this.tableName} named ${name}: ${(error as Error).message}`);
        }
    }

    async getIdByName(name: string): Promise<number>
    {
        try
        {
            const trainer = await db.queryOne<Trainer>("SELECT id FROM trainers WHERE LOWER(name) = LOWER(?)", [name]);
            return (!trainer || !trainer.id) ? Promise.reject(new Error(`Unknown trainer '${name}'`)) : trainer.id;
        }
        catch (error)
        {
            throw new Error(`Error fetching trainer ID for ${name}: ${(error as Error).message}`);
        }
    }
}

const trainerService = new TrainerService();
export default trainerService;