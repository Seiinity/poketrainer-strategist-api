import pokemonService from "../services/pokemon-service";
import { Controller } from "./controller";
import { PokemonBody } from "../models/pokemon";

export default new Controller(pokemonService, PokemonBody);
