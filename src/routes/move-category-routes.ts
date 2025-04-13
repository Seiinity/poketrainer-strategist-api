import express from "express";

import moveCategoryController from "../controllers/move-category-controller";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", moveCategoryController.index);
router.get("/:id", moveCategoryController.show);

export default router;
