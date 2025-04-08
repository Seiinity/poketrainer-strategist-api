import express from "express";

import typeController from "../controllers/type-controller";
import { validateId } from "../middleware/validate-id";
import validateTypeBody from "../middleware/validate-type";

const router = express.Router();

router.param("id", validateId);

router.get("/", typeController.index);
router.get("/:id", typeController.show);
router.post("/", validateTypeBody, typeController.store);
router.put("/:id", validateTypeBody, typeController.update);
router.delete("/:id", typeController.destroy);

export default router;
