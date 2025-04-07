import { Request, Response } from "express";
import pokemonService from "../services/pokemon-service";
import { PokemonBody } from "../models/pokemon";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const teams = await pokemonService.getAllPokemon();
        res.json(teams);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function show(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = parseInt(req.params.id);
        const pokemon = await pokemonService.getPokemonById(id);

        if (!pokemon) res.status(404).json({ error: "Pokémon not found." });
        else res.json(pokemon);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function store(req: Request, res: Response): Promise<void>
{
    try
    {
        const newPokemon: PokemonBody =
        {
            nickname: req.body.nickname,
            species: req.body.species,
            teamId: req.body.teamId
        };

        const insertedPokemon = await pokemonService.createPokemon(newPokemon);
        res.status(200).json(insertedPokemon);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function update(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = parseInt(req.params.id);
        const newPokemon: PokemonBody =
        {
            nickname: req.body.nickname,
            species: req.body.species,
            teamId: req.body.teamId
        };

        const updatedPokemon = await pokemonService.updatePokemonById(id, newPokemon);

        if (!updatedPokemon) res.status(404).json({ error: "Pokémon not found." });
        else res.status(200).json(updatedPokemon);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

async function destroy(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = parseInt(req.params.id);
        const result = await pokemonService.deletePokemonById(id);

        if (!result) res.status(404).json({ error: "Pokémon not found." });
        else res.json(`Pokémon ${id} deleted.`);
    }
    catch (error)
    {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
}

export default
{
    index,
    show,
    store,
    update,
    destroy
};
