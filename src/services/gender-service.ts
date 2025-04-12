import db from "../db/mysql";

class GenderService
{
    async getIdByName(name: string): Promise<number>
    {
        try
        {
            const query = `SELECT gender_id AS id FROM genders WHERE LOWER(name) = LOWER(?)`;
            const result = await db.queryOne<{ id: number }>(query, [name]);
            return (!result || !result.id) ? Promise.reject(new Error(`Gender '${name}' does not exist.`)) : result.id;
        }
        catch (error)
        {
            throw new Error(`Error fetching gender ID for ${name}: ${(error as Error).message}`);
        }
    }
}

export default new GenderService();