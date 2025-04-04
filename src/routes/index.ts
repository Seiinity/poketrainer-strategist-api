import express from "express";

import speciesRoutes from "./species-routes";

const router = express.Router();

router.use("/species", speciesRoutes);

export default router;