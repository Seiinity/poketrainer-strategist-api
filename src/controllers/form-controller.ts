import { Controller } from "./controller";
import formService from "../services/form-service";
import { FormBody } from "../models/form";

export default new Controller(formService, FormBody);