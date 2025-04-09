import express from "express";

import trainerController from "../controllers/trainer-controller";
import { validateId, sanitiseIdOrName } from "../middleware/validate-id";
import { validateTrainerBodyOptional, validateTrainerBodyRequired, validateTrainerLogin } from "../middleware/validate-trainer";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", trainerController.index);
router.get("/login", validateTrainerLogin, trainerController.login);
router.get("/:idName", trainerController.show);
router.post("/", validateTrainerBodyRequired, trainerController.store);
router.put("/:id", validateTrainerBodyOptional, trainerController.update);
router.delete("/:id", trainerController.destroy);

export default router;
