import pokemonService from "../services/pokemon-service";
import { Request, Response } from "express";
import { PokemonBody } from "../models/pokemon";

async function index(_req: Request, res: Response): Promise<void>
{
    try
    {
        const pokemon = await pokemonService.find();
        res.json(pokemon);
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
        const pokemon = await pokemonService.getById(id);

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
        const newPokemon = new PokemonBody(req.body);
        const insertedPokemon = await pokemonService.create(newPokemon);
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
        const newPokemon = new PokemonBody(req.body);
        const updatedPokemon = await pokemonService.update(id, newPokemon);

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
        const result = await pokemonService.delete(id);

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
