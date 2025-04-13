import db from "../db/mysql";
import speciesService from "./species-service";
import teamService from "./team-service";
import statService from "./stat-service";
import natureService from "./nature-service";
import pokemonAdapter from "../adapters/pokemon-adapter";
import abilityService from "./ability-service";
import { Service } from "./service";
import { Pokemon, PokemonBody } from "../models/pokemon";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import genderService from "./gender-service";
import moveService from "./move-service";

export class PokemonService extends Service<Pokemon, PokemonBody>
{
    protected adapter = pokemonAdapter;
    protected tableName = "pokemon";
    protected tableAlias = "pk";
    protected idField = "pokemon_id";
    protected searchField = "p.nickname";

    protected baseSelectQuery = `
        SELECT
            pk.pokemon_id, pk.nickname, pk.level,
            sp.species_id, sp.name AS species_name,
            tm.team_id, tm.name AS team_name,
            nt.nature_id, nt.name AS nature_name,
            ab.ability_id, ab.name as ability_name,
            gn.name as gender_name
        FROM pokemon pk
        LEFT JOIN species sp ON pk.species_id = sp.species_id
        LEFT JOIN teams tm ON pk.team_id = tm.team_id
        LEFT JOIN natures nt ON pk.nature_id = nt.nature_id
        LEFT JOIN abilities ab ON pk.ability_id = ab.ability_id
        LEFT JOIN genders gn ON pk.gender_id = gn.gender_id
    `;

    protected override async processRequestBody(body: PokemonBody): Promise<PokemonBody>
    {
        const processed = { ...body };

        if (body.species)
        {
            processed.speciesId = await speciesService.nameLookup.getIdByName(body.species);
        }

        if (body.ability)
        {
            processed.abilityId = await abilityService.nameLookup.getIdByName(body.ability);
        }

        if (body.teamId)
        {
            const team = await teamService.getById(body.teamId);
            if (team == null) return Promise.reject(new Error(`No team found with ID ${body.teamId}.`));
        }

        if (body.nature)
        {
            processed.natureId = await natureService.nameLookup.getIdByName(body.nature);
        }

        if (body.gender)
        {
            processed.genderId = await genderService.getIdByName(body.gender);
        }

        return processed;
    }

    protected override async adaptToModel(row: RowDataPacket): Promise<Pokemon>
    {
        row.stats = await statService.getByPokemonId(row.pokemon_id);
        row.moves = await moveService.getByPokemonId(row.pokemon_id);
        return super.adaptToModel(row);
    }

    protected override async insertRelations(connection: PoolConnection, id: number, body: PokemonBody): Promise<void>
    {
        await this.insertEVRelations(connection, id, body);
        await this.insertIVRelations(connection, id, body);
        await this.insertMoveRelations(connection, id, body);
    }

    async geByTeamId(teamId: number): Promise<RowDataPacket[]>
    {
        try
        {
            return await db.queryTyped<RowDataPacket>
            (
                `SELECT p.pokemon_id,
                        p.nickname,
                        s.name AS species_name
                 FROM pokemon p
                          LEFT JOIN species s ON p.species_id = s.species_id
                 WHERE p.team_id = ?`,
                [teamId]
            );
        }
        catch (error)
        {
            throw new Error(`Error fetching Pokémon reference by team ID: ${(error as Error).message}`);
        }
    }

    private async insertEVRelations(connection: PoolConnection, id: number, body: PokemonBody): Promise<void>
    {
        if (!body.evs) return;

        const evCount = await statService.count();

        if (body.evs.length != evCount)
        {
            throw new Error(`EV count must be exactly ${evCount}.`);
        }

        const values: number[][] = [];

        body.evs.forEach((ev, index) =>
        {
            values.push([id, index + 1, ev]);
        });

        await connection.query("DELETE FROM pokemon_evs WHERE pokemon_id = ?", [id]);
        await connection.query("INSERT INTO pokemon_evs VALUES ?", [values]);
    }

    private async insertIVRelations(connection: PoolConnection, id: number, body: PokemonBody): Promise<void>
    {
        if (!body.ivs) return;

        const ivCount = await statService.count();

        if (body.ivs.length != ivCount)
        {
            throw new Error(`IV count must be exactly ${ivCount}.`);
        }

        const values: number[][] = [];

        body.ivs.forEach((iv, index) =>
        {
            values.push([id, index + 1, iv]);
        });

        await connection.query("DELETE FROM pokemon_ivs WHERE pokemon_id = ?", [id]);
        await connection.query("INSERT INTO pokemon_ivs VALUES ?", [values]);
    }

    private async insertMoveRelations(connection: PoolConnection, id: number, body: PokemonBody): Promise<void>
    {
        if (!body.moves) return;

        const values: number[][] = [];

        for (const move of body.moves)
        {
            const index = body.moves.indexOf(move);
            const moveId = await moveService.nameLookup.getIdByName(move);
            values.push([id, moveId, index + 1]);
        }

        await connection.query("DELETE FROM pokemon_moves WHERE pokemon_id = ?", [id]);
        await connection.query("INSERT INTO pokemon_moves VALUES ?", [values]);
    }
}

export default new PokemonService();
