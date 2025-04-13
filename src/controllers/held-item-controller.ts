import heldItemService from "../services/held-item-service";
import { Controller } from "./controller";
import { HeldItemBody } from "../models/held-item";

export default new Controller(heldItemService, HeldItemBody);