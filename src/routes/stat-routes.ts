import express from "express";

import statController from "../controllers/stat-controller";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", statController.index);
router.get("/:id", statController.show);

export default router;
