import express from "express";

import speciesRoutes from "./species-routes";
import trainerRoutes from "./trainer-routes";
import typeRoutes from "./type-routes";

const router = express.Router();

router.use("/species", speciesRoutes);
router.use("/trainers", trainerRoutes);
router.use("/types", typeRoutes);

export default router;