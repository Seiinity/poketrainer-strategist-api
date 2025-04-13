import express from "express";

import heldItemController from "../controllers/held-item-controller";
import heldItemValidator from "../middleware/held-item-validator";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", heldItemController.index);
router.get("/:id", heldItemController.show);
router.post("/", heldItemValidator.validateRequired, heldItemController.store);
router.put("/:id", heldItemValidator.validateOptional, heldItemController.update);
router.delete("/:id", heldItemController.destroy);

export default router;
