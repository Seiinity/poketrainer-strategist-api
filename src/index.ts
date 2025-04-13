import config from "./config";

import express from "express";
import cors from "cors";
import routes from "./routes";
import path from "node:path";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve("./public")));
app.use("/api", routes);

app.listen(config.port, () =>
{
    console.log(`Listening on port ${config.port}!`);
});
