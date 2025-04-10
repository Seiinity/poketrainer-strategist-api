import statService from "../services/stat-service";
import { ReadOnlyController } from "./controller";

export default new ReadOnlyController(statService);
