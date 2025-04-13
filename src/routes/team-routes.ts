import express from "express";

import teamController from "../controllers/team-controller";
import { validateId } from "../middleware/validate-id";
import teamValidator from "../middleware/team-validator";

const router = express.Router();

router.param("id", validateId);

router.get("/", teamController.index);
router.get("/:id", teamController.show);
router.post("/", teamValidator.validateRequired, teamController.store);
router.put("/:id", teamValidator.validateOptional, teamController.update);
router.delete("/:id", teamController.destroy);

export default router;
