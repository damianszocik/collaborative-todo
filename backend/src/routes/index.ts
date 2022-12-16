import { Router } from "express";
import { todoRouter } from "./todo";
import { todoItemRouter } from "./todoItem";

export const apiRouter = Router();

apiRouter.use("/todo", todoRouter);
apiRouter.use("/todo-item", todoItemRouter);
