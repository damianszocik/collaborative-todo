import {
  createTodoItem,
  deleteTodoItem,
  modifyTodoItem,
} from "controllers/todoItem";
import { Router } from "express";
import { validateRequest } from "middleware/validateRequest";
import { z } from "zod";

const todoItemBodySchemaValidator = z.object({
  title: z.string(),
  content: z.string().optional(),
  done: z.boolean().optional(),
  todoId: z.string(),
});

export const todoItemRouter = Router();

todoItemRouter.patch(
  "/:id",
  validateRequest({
    body: todoItemBodySchemaValidator.omit({ todoId: true }).partial(),
  }),
  modifyTodoItem
);
todoItemRouter.delete("/:id", deleteTodoItem);
todoItemRouter.post(
  "/",
  validateRequest({ body: todoItemBodySchemaValidator }),
  createTodoItem
);
