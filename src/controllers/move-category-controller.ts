import { ReadOnlyController } from "./controller";
import moveCategoryService from "../services/move-category-service";

export default new ReadOnlyController(moveCategoryService);