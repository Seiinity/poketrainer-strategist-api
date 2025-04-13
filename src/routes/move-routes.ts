import express from "express";

import idValidator from "../middleware/id-validator";
import moveController from "../controllers/move-controller";
import moveValidator from "../middleware/move-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", moveController.index);
router.get("/:id", moveController.show);
router.post("/", moveValidator.validateRequired, moveController.store);
router.put("/:id", moveValidator.validateOptional, moveController.update);
router.delete("/:id", moveController.destroy);

export default router;