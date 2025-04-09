import pokemonService from "../services/pokemon-service";
import { PokemonBody } from "../models/pokemon";
import { Controller } from "./controller";

export default new Controller(pokemonService, PokemonBody);
