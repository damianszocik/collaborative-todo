import {
  createTodo,
  deleteTodo,
  getSingleTodo,
  getTodos,
  modifyTodo,
} from "controllers/todo";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "middleware/validateRequest";

export const todoRouter = Router();

const todoBodySchemaValidator = z.object({
  title: z.string({ required_error: "title property is required" }),
  content: z.string({ required_error: "content property is required" }),
});

todoRouter.get("/all", getTodos);
todoRouter.get("/:id", getSingleTodo);
todoRouter.post(
  "/",
  validateRequest({ body: todoBodySchemaValidator }),
  createTodo
);
todoRouter.patch(
  "/:id",
  validateRequest({ body: todoBodySchemaValidator }),
  modifyTodo
);
todoRouter.delete("/:id", deleteTodo);
