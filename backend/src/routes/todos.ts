import {
  createTodo,
  deleteTodo,
  getSingleTodo,
  getTodos,
  modifyTodo,
} from "controllers/todos";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "middleware/validateRequest";

export const todosRouter = Router();

const todoBodySchemaValidator = z.object({
  title: z.string({ required_error: "title property is required" }),
  content: z.string({ required_error: "content property is required" }),
});

todosRouter.get("/", getTodos);
todosRouter.get("/:id", getSingleTodo);
todosRouter.post(
  "/",
  validateRequest({ body: todoBodySchemaValidator }),
  createTodo
);
todosRouter.patch(
  "/:id",
  validateRequest({ body: todoBodySchemaValidator }),
  modifyTodo
);
todosRouter.delete("/:id", deleteTodo);
