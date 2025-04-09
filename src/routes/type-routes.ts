import express from "express";

import typeController from "../controllers/type-controller";
import { sanitiseIdOrName, validateId } from "../middleware/validate-id";
import validateTypeBody from "../middleware/validate-type";

const router = express.Router();

router.param("id", validateId);
router.param("idName", sanitiseIdOrName);

router.get("/", typeController.index);
router.get("/:idName", typeController.show);
router.post("/", validateTypeBody, typeController.store);
router.put("/:id", validateTypeBody, typeController.update);
router.delete("/:id", typeController.destroy);

export default router;
