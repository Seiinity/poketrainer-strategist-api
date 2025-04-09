import teamService from "../services/team-service";
import { TeamBody } from "../models/team";
import { Controller } from "./controller";

export default new Controller(teamService, TeamBody);