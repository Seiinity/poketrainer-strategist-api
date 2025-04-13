import { RowDataPacket } from "mysql2";
import { Team, TeamBody, TeamReference } from "../models/team";
import { TrainerReference } from "../models/trainer";
import { Adapter } from "./adapter";
import { MySQLData } from "../types/mysql-types";
import pokemonAdapter from "./pokemon-adapter";

class TeamAdapter extends Adapter<Team, TeamBody>
{
    fromMySQL(row: RowDataPacket): Team
    {
        return new Team
        ({
            id: row.team_id,
            name: row.name,
            trainer: new TrainerReference(row.trainer_name, row.trainer_id),
            pokemon: row.pokemon.map((p: RowDataPacket) => pokemonAdapter.referenceFromMySQL(p)),
        });
    }

    referenceFromMySQL(row: RowDataPacket): TeamReference
    {
        return new TeamReference(row.name, row.team_id);
    }

    toMySQL(requestBody: TeamBody): MySQLData
    {
        return {
            trainer_id: requestBody.trainerId,
            name: requestBody.name,
        };
    }
}

export default new TeamAdapter();
