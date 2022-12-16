import { Router } from "express";
import { todoRouter } from "./todo";

export const apiRouter = Router();

apiRouter.use("/todo", todoRouter);
