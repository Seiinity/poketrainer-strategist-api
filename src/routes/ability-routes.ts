import express from "express";

import abilityController from "../controllers/ability-controller";
import abilityValidator from "../middleware/ability-validator";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);
router.param("idName", idValidator.sanitise);

router.get("/", abilityController.index);
router.get("/:idName", abilityController.show);
router.post("/", abilityValidator.validateRequired, abilityController.store);
router.put("/:id", abilityValidator.validateOptional, abilityController.update);
router.delete("/:id", abilityController.destroy);

export default router;
