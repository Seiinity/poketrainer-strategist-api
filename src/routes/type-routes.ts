import express from "express";

import typeController from "../controllers/type-controller";
import typeValidator from "../middleware/type-validator";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", typeController.index);
router.get("/:idName", typeController.show);
router.post("/", typeValidator.validateRequired, typeController.store);
router.put("/:id", typeValidator.validateOptional, typeController.update);
router.delete("/:id", typeController.destroy);

export default router;
