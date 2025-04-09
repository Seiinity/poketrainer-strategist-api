import express from "express";

import abilityRoutes from "./ability-routes";
import pokemonRoutes from "./pokemon-routes";
import speciesRoutes from "./species-routes";
import teamRoutes from "./team-routes";
import trainerRoutes from "./trainer-routes";
import typeRoutes from "./type-routes";
import config from "../config";

const router = express.Router();

router.use(config.abilityPath, abilityRoutes);
router.use(config.pokemonPath, pokemonRoutes);
router.use(config.speciesPath, speciesRoutes);
router.use(config.teamPath, teamRoutes);
router.use(config.trainerPath, trainerRoutes);
router.use(config.typePath, typeRoutes);

export default router;
