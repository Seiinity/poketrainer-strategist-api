import express from "express";

import trainersController from "../controllers/trainers-controller";
import validateId from "../middleware/validate-id";
import validateTrainerBody from "../middleware/validate-trainer";

const router = express.Router();

router.param("id", validateId);

router.get("/", trainersController.index);
router.get("/:id", trainersController.show);
router.post("/", validateTrainerBody, trainersController.store);
router.put("/:id", validateTrainerBody, trainersController.update);
router.delete("/:id", trainersController.destroy);

export default router;