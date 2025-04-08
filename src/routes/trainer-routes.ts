import express from "express";

import trainerController from "../controllers/trainer-controller";
import { validateId, sanitiseId } from "../middleware/validate-id";
import { validateTrainerBody, validateTrainerLogin } from "../middleware/validate-trainer";

const router = express.Router();

router.get("/", trainerController.index);
router.get("/login", validateTrainerLogin, trainerController.login);
router.get("/:id", sanitiseId, trainerController.show);
router.post("/", validateTrainerBody, trainerController.store);
router.put("/:id", validateId, validateTrainerBody, trainerController.update);
router.delete("/:id", validateId, trainerController.destroy);

export default router;
