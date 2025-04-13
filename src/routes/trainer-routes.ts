import express from "express";

import trainerController from "../controllers/trainer-controller";
import { validateId, sanitiseIdOrName } from "../middleware/validate-id";
import trainerValidator from "../middleware/trainer-validator";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", trainerController.index);
router.get("/login", trainerValidator.validateLogin, trainerController.login);
router.get("/:idName", trainerController.show);
router.post("/", trainerValidator.validateRequired, trainerController.store);
router.put("/:id", trainerValidator.validateOptional, trainerController.update);
router.delete("/:id", trainerController.destroy);

export default router;
