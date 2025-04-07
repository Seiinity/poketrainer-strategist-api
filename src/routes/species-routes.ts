import express from "express";

import speciesController from "../controllers/species-controller";
import validateId from "../middleware/validate-id";
import validateSpeciesBody from "../middleware/validate-species";

const router = express.Router();

router.param("id", validateId);

router.get("/", speciesController.index);
router.get("/:id", speciesController.show);
router.post("/", validateSpeciesBody, speciesController.store);
router.put("/:id", validateSpeciesBody, speciesController.update);
router.delete("/:id", speciesController.destroy);

export default router;
