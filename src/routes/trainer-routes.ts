import express from "express";

import trainerController from "../controllers/trainer-controller";
import validateId from "../middleware/validate-id";
import validateTrainerBody from "../middleware/validate-trainer";

const router = express.Router();

router.param("id", validateId);

router.get("/", trainerController.index);
router.get("/:id", trainerController.show);
router.post("/", validateTrainerBody, trainerController.store);
router.put("/:id", validateTrainerBody, trainerController.update);
router.delete("/:id", trainerController.destroy);

export default router;