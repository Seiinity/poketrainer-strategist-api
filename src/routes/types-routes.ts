import express from "express";

import typesController from "../controllers/types-controller";
import validateId from "../middleware/validate-id";
import validateTypeBody from "../middleware/validate-type";

const router = express.Router();

router.param("id", validateId);

router.get("/", typesController.index);
router.get("/:id", typesController.show);
router.post("/", validateTypeBody, typesController.store);
router.put("/:id", validateTypeBody, typesController.update);
router.delete("/:id", typesController.destroy);

export default router;
