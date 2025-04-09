import config from "./config";

import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(config.port, () =>
{
    console.log(`Listening on port ${config.port}!`);
});
