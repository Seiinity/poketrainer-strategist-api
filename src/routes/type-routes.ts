import express from "express";

import typeController from "../controllers/type-controller";
import typeValidator from "../middleware/type-validator";
import idValidator from "../middleware/id-validator";

const router = express.Router();

router.param("id", idValidator.validate);
router.param("idName", idValidator.sanitise);

router.get("/", typeController.index);
router.get("/:idName", typeController.show);
router.post("/", typeValidator.validateRequired, typeController.store);
router.put("/:id", typeValidator.validateOptional, typeController.update);
router.delete("/:id", typeController.destroy);

export default router;
