import express from "express";

import pokemonRoutes from "./pokemon-routes";
import speciesRoutes from "./species-routes";
import teamRoutes from "./team-routes";
import trainerRoutes from "./trainer-routes";
import typeRoutes from "./type-routes";

const router = express.Router();

router.use("/pokemon", pokemonRoutes);
router.use("/species", speciesRoutes);
router.use("/teams", teamRoutes);
router.use("/trainers", trainerRoutes);
router.use("/types", typeRoutes);

export default router;