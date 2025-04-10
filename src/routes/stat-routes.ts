import express from "express";

import statController from "../controllers/stat-controller";
import { validateId } from "../middleware/validate-id";

const router = express.Router();

router.param("id", validateId);

router.get("/", statController.index);
router.get("/:id", statController.show);

export default router;
