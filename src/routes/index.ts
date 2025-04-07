import express from "express";

import speciesRoutes from "./species-routes";
import typesRoutes from "./types-routes";

const router = express.Router();

router.use("/species", speciesRoutes);
router.use("/types", typesRoutes);

export default router;