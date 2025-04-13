import express from "express";

import pokemonController from "../controllers/pokemon-controller";
import idValidator from "../middleware/id-validator";
import pokemonValidator from "../middleware/pokemon-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", pokemonController.index);
router.get("/:id", pokemonController.show);
router.post("/", pokemonValidator.validateRequired, pokemonController.store);
router.put("/:id", pokemonValidator.validateOptional, pokemonController.update);
router.delete("/:id", pokemonController.destroy);

export default router;
