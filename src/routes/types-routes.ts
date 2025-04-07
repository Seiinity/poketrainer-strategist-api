import express from "express";

import typesController from "../controllers/types-controller";
import validateId from "../middleware/validate-id";

const router = express.Router();

router.param("id", validateId);

router.get("/", typesController.index);
router.get("/:id", typesController.show);
router.post("/", typesController.store);
router.put("/:id", typesController.update);
router.delete("/:id", typesController.destroy);

export default router;
