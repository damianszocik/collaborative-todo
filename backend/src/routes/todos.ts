import {
  createTodo,
  deleteTodo,
  getSingleTodo,
  getTodos,
  modifyTodo,
} from "controllers/todos";
import { Router } from "express";

export const todosRouter = Router();

todosRouter.get("/", getTodos);
todosRouter.get("/:id", getSingleTodo);
todosRouter.post("/", createTodo);
todosRouter.patch("/:id", modifyTodo);
todosRouter.delete("/:id", deleteTodo);
