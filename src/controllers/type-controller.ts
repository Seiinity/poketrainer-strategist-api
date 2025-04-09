import typeService from "../services/type-service";
import { NameLookupController } from "./controller";
import { TypeBody } from "../models/type";

export default new NameLookupController(typeService, TypeBody);
