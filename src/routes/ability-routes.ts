import express from "express";

import abilityController from "../controllers/ability-controller";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";
import { validateAbilityBodyOptional, validateAbilityBodyRequired } from "../middleware/validate-ability";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", abilityController.index);
router.get("/:idName", abilityController.show);
router.post("/", validateAbilityBodyRequired, abilityController.store);
router.put("/:id", validateAbilityBodyOptional, abilityController.update);
router.delete("/:id", abilityController.destroy);

export default router;
