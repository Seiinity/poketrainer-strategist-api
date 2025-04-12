import { ReadOnlyController } from "./controller";
import natureService from "../services/nature-service";

export default new ReadOnlyController(natureService);