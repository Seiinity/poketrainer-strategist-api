import express from "express";

import teamController from "../controllers/team-controller";
import { validateId } from "../middleware/validate-id";
import validateTeamBody from "../middleware/validate-team";

const router = express.Router();

router.param("id", validateId);

router.get("/", teamController.index);
router.get("/:id", teamController.show);
router.post("/", validateTeamBody, teamController.store);
router.put("/:id", validateTeamBody, teamController.update);
router.delete("/:id", teamController.destroy);

export default router;
