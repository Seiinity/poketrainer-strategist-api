import express from "express";

import trainerController from "../controllers/trainer-controller";
import idValidator from "../middleware/id-validator";
import trainerValidator from "../middleware/trainer-validator";

const router = express.Router();

router.param("id", idValidator.validate);
router.param("idName", idValidator.sanitise);

router.get("/", trainerController.index);
router.get("/login", trainerValidator.validateLogin, trainerController.login);
router.get("/:idName", trainerController.show);
router.post("/", trainerValidator.validateRequired, trainerController.store);
router.put("/:id", trainerValidator.validateOptional, trainerController.update);
router.delete("/:id", trainerController.destroy);

export default router;
