import teamService from "../services/team-service";
import { Controller } from "./controller";
import { TeamBody } from "../models/team";

export default new Controller(teamService, TeamBody);
