import express from "express";

import pokemonController from "../controllers/pokemon-controller";
import { validateId } from "../middleware/validate-id";
import validatePokemonBody from "../middleware/validate-pokemon";

const router = express.Router();

router.param("id", validateId);

router.get("/", pokemonController.index);
router.get("/:id", pokemonController.show);
router.post("/", validatePokemonBody, pokemonController.store);
router.put("/:id", validatePokemonBody, pokemonController.update);
router.delete("/:id", pokemonController.destroy);

export default router;
