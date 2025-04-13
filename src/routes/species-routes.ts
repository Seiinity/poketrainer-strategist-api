import express from "express";

import speciesController from "../controllers/species-controller";
import idValidator from "../middleware/id-validator";
import speciesValidator from "../middleware/species-validator";

const router = express.Router();

router.param("id", idValidator.validate);
router.param("idName", idValidator.sanitise);

router.get("/", speciesController.index);
router.get("/:idName", speciesController.show);
router.post("/", speciesValidator.validateRequired, speciesController.store);
router.put("/:id", speciesValidator.validateOptional, speciesController.update);
router.delete("/:id", speciesController.destroy);

export default router;
