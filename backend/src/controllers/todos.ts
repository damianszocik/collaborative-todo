import { RequestHandler, Response } from "express";
import { handleMessageResponse, isExpectedError } from "utils/handleResponse";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { v4 as uuid } from "uuid";

const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string(),
  createdById: z.number(),
  createdAt: z.number(),
  modifiedById: z.optional(z.number()),
  modifiedAt: z.optional(z.number()),
});

type Todo = z.infer<typeof todoSchema>;

const todos: Todo[] = [];

const handleControllerError = (res: Response, error: unknown) => {
  if (error instanceof z.ZodError) {
    handleMessageResponse(res, 400, fromZodError(error).message);
  } else if (isExpectedError(error)) {
    handleMessageResponse(res, error.code, error.message);
  } else {
    handleMessageResponse(res);
  }
};

export const getTodos: RequestHandler = (req, res) => {
  res.json(todos);
};

export const getSingleTodo: RequestHandler<{ todoId: string }> = (req, res) => {
  try {
    const { todoId } = req.params;
    if (!todoId) {
      throw { code: 400, message: "todoId must be provided" };
    }
    const matchedTodo = todos.find((todo) => todo.id === todoId);
    if (!matchedTodo) {
      throw { code: 404, message: "can't find a todo with provided id" };
    }
    res.json(matchedTodo);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createTodo: RequestHandler<
  void,
  any,
  Pick<Todo, "title" | "content">
> = (req, res) => {
  try {
    const newTodo = todoSchema
      .pick({ title: true, content: true })
      .strict()
      .parse(req.body);
    todos.push({
      ...newTodo,
      id: uuid(),
      createdById: 2, //TODO: get user from user context (JWT)
      createdAt: new Date().valueOf(),
    });
    res.sendStatus(201);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const modifyTodo: RequestHandler<
  {
    todoId: string;
  },
  any,
  Partial<Todo>
> = (req, res) => {
  try {
    const { todoId } = req.params;
    const newTodoBody = todoSchema.partial().parse(req.body);
    if (!todoId) {
      throw { code: 400, message: "todoId not provided" };
    }
    if (!newTodoBody) {
      throw { code: 400, message: "todoBody not provided" };
    }
    const matchedTodoIndex = todos.findIndex((todo) => todo.id === todoId);
    if (matchedTodoIndex < 0) {
      throw { code: 400, message: "can't find todo with provided id" };
    }
    const oldTodo = todos[matchedTodoIndex];
    const newTodo = {
      ...oldTodo,
      ...newTodoBody,
      id: oldTodo.id,
      modifiedAt: new Date().valueOf(),
      modifiedById: 2, //TODO: get user from user context (JWT)
    };
    todos[matchedTodoIndex] = newTodo;
    handleMessageResponse(res, 201, "todo updated", {
      todo: newTodo,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteTodo: RequestHandler<{ todoId: string }> = (req, res) => {
  const { todoId } = req.params;
  if (!todoId) {
    throw { code: 400, message: "todoId not provided" };
  }
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0) {
    throw { code: 404, message: "can't find todo with provided id" };
  }
  todos.splice(todoIndex, 1);
  res.sendStatus(200);
};
