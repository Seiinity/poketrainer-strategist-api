import express from "express";

import speciesController from "../controllers/species-controller";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";
import speciesValidator from "../middleware/species-validator";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", speciesController.index);
router.get("/:idName", speciesController.show);
router.post("/", speciesValidator.validateRequired, speciesController.store);
router.put("/:id", speciesValidator.validateOptional, speciesController.update);
router.delete("/:id", speciesController.destroy);

export default router;
