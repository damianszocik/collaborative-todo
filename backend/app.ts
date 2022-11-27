import express from "express";
import { todosRouter } from "routes/todos";
import { PORT } from "config/constants";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "siema!" });
});

app.use("/todos", todosRouter);
