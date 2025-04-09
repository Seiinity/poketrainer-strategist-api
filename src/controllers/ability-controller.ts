import abilityService from "../services/ability-service";
import { NameLookupController } from "./controller";
import { AbilityBody } from "../models/ability";

export default new NameLookupController(abilityService, AbilityBody);
