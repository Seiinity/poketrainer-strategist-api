import express from "express";

import pokemonController from "../controllers/pokemon-controller";
import { validateId } from "../middleware/validate-id";
import { validatePokemonBodyOptional, validatePokemonBodyRequired } from "../middleware/validate-pokemon";

const router = express.Router();

router.param("id", validateId);

router.get("/", pokemonController.index);
router.get("/:id", pokemonController.show);
router.post("/", validatePokemonBodyRequired, pokemonController.store);
router.put("/:id", validatePokemonBodyOptional, pokemonController.update);
router.delete("/:id", pokemonController.destroy);

export default router;
