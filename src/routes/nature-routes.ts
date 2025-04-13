import express from "express";

import natureController from "../controllers/nature-controller";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", natureController.index);
router.get("/:id", natureController.show);

export default router;