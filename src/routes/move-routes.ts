import express from "express";

import idValidator from "../middleware/id-validator";
import moveController from "../controllers/move-controller";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", moveController.index);
router.get("/:id", moveController.show);
router.post("/", moveController.store);
router.put("/:id", moveController.update);
router.delete("/:id", moveController.destroy);

export default router;