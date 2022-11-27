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
todosRouter.get("/:todoId", getSingleTodo);
todosRouter.post("/", createTodo);
todosRouter.patch("/:todoId", modifyTodo);
todosRouter.delete("/:todoId", deleteTodo);
