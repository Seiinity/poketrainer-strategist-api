import express from "express";

import abilityController from "../controllers/ability-controller";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";
import validateAbilityBody from "../middleware/validate-ability";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", abilityController.index);
router.get("/:idName", abilityController.show);
router.post("/", validateAbilityBody, abilityController.store);
router.put("/:id", validateAbilityBody, abilityController.update);
router.delete("/:id", abilityController.destroy);

export default router;
