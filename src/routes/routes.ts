import express from "express";

import speciesController from "../controllers/species-controller.js";

const router = express.Router();

router.get("/species/", speciesController.index);
router.get("/species/:id", speciesController.show);
router.post("/species/", speciesController.store);
router.put("/species/:id", speciesController.update);
router.delete("/species/:id", speciesController.destroy);

export default router;