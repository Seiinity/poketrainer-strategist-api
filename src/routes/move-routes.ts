import express from "express";

import { validateId } from "../middleware/validate-id";
import moveController from "../controllers/move-controller";

const router = express.Router();

router.param("id", validateId);

router.get("/", moveController.index);
router.get("/:id", moveController.show);
router.post("/", moveController.store);
router.put("/:id", moveController.update);
router.delete("/:id", moveController.destroy);

export default router;