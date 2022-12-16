import express from "express";
import { PORT } from "config/constants";
import morgan from "morgan";
import { apiRouter } from "routes";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.use("/api", apiRouter);
