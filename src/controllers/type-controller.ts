import typeService from "../services/type-service";
import { TypeBody } from "../models/type";
import { NameLookupController } from "./controller";

export default new NameLookupController(typeService, TypeBody);
