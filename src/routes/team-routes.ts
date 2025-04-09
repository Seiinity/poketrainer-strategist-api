import express from "express";

import teamController from "../controllers/team-controller";
import { validateId } from "../middleware/validate-id";
import { validateTeamBodyOptional, validateTeamBodyRequired } from "../middleware/validate-team";

const router = express.Router();

router.param("id", validateId);

router.get("/", teamController.index);
router.get("/:id", teamController.show);
router.post("/", validateTeamBodyRequired, teamController.store);
router.put("/:id", validateTeamBodyOptional, teamController.update);
router.delete("/:id", teamController.destroy);

export default router;
