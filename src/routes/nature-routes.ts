import express from "express";

import natureController from "../controllers/nature-controller";
import { validateId } from "../middleware/validate-id";

const router = express.Router();

router.param("id", validateId);

router.get("/", natureController.index);
router.get("/:id", natureController.show);

export default router;