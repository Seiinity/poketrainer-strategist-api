import express from "express";

import speciesController from "../controllers/species-controller";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";
import validateSpeciesBody from "../middleware/validate-species";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", speciesController.index);
router.get("/:idName", speciesController.show);
router.post("/", validateSpeciesBody, speciesController.store);
router.put("/:id", validateSpeciesBody, speciesController.update);
router.delete("/:id", speciesController.destroy);

export default router;
