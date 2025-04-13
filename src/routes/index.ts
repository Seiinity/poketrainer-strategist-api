import express from "express";

import abilityRoutes from "./ability-routes";
import natureRoutes from "./nature-routes";
import moveCategoryRoutes from "./move-category-routes";
import moveRoutes from "./move-routes";
import pokemonRoutes from "./pokemon-routes";
import statRoutes from "./stat-routes";
import speciesRoutes from "./species-routes";
import teamRoutes from "./team-routes";
import trainerRoutes from "./trainer-routes";
import typeRoutes from "./type-routes";
import config from "../config";

const router = express.Router();

router.use(config.abilityPath, abilityRoutes);
router.use(config.naturePath, natureRoutes);
router.use(config.moveCategoryPath, moveCategoryRoutes);
router.use(config.movePath, moveRoutes);
router.use(config.pokemonPath, pokemonRoutes);
router.use(config.statPath, statRoutes);
router.use(config.speciesPath, speciesRoutes);
router.use(config.teamPath, teamRoutes);
router.use(config.trainerPath, trainerRoutes);
router.use(config.typePath, typeRoutes);

export default router;
