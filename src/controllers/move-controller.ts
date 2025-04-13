import { Controller } from "./controller";
import moveService from "../services/move-service";
import { MoveBody } from "../models/move";

export default new Controller(moveService, MoveBody);
