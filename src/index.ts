import config from './config/config';

import express from "express";
import cors from "cors";
import routes from "./routes";

const index = express();

index.use(cors());
index.use(express.json());

index.use("/api", routes);

index.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
});