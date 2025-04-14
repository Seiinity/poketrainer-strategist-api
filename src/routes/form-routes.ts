import express from "express";
import idValidator from "../middleware/id-validator";
import formController from "../controllers/form-controller";
import formValidator from "../middleware/form-validator";

const router = express.Router();

router.param("id", idValidator.validate);

router.get("/", formController.index);
router.get("/:id", formController.show);
router.post("/", formValidator.validateRequired, formController.store);
router.put("/:id", formValidator.validateOptional, formController.update);
router.delete("/:id", formController.destroy);

export default router;