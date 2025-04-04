import express from "express";

import speciesController from "../controllers/species-controller";

const router = express.Router();

router.get("/", speciesController.index);
router.get("/:id", speciesController.show);
router.post("/", speciesController.store);
router.put("/:id", speciesController.update);
router.delete("/:id", speciesController.destroy);

export default router;