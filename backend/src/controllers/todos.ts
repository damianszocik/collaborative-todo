import { Prisma } from "@prisma/client";
import { RequestHandler, Response } from "express";
import { prisma, Todo } from "utils/db";
import { handleMessageResponse, isExpectedError } from "utils/handleResponse";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date(),
});

const handleControllerError = (res: Response, error: unknown) => {
  if (error instanceof z.ZodError) {
    handleMessageResponse(res, 400, fromZodError(error).message);
  } else if (
    isExpectedError(error) &&
    !(error instanceof Prisma.PrismaClientKnownRequestError)
  ) {
    handleMessageResponse(res, error.code, error.message);
  } else {
    handleMessageResponse(res);
  }
};

export const getTodos: RequestHandler = async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
};

export const getSingleTodo: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw { code: 400, message: "todo id must be provided" };
    }
    const matchedTodo = await prisma.todo.findUnique({ where: { id } });
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
> = async (req, res) => {
  try {
    const data = todoSchema
      .pick({ title: true, content: true })
      .strict()
      .parse(req.body);
    const createdTodo = await prisma.todo.create({ data });
    res.status(201).json(createdTodo);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const modifyTodo: RequestHandler<
  {
    id: string;
  },
  any,
  Partial<Todo>
> = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw { code: 400, message: "todo id not provided" };
    }
    if (!req.body) {
      throw { code: 400, message: "todo body not provided" };
    }
    const data = todoSchema.partial().parse(req.body);
    const todo = await prisma.todo.update({ where: { id }, data });
    handleMessageResponse(res, 201, "todo updated", {
      todo,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteTodo: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw { code: 400, message: "todoId not provided" };
    }
    await prisma.todo.delete({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    handleControllerError(res, error);
  }
};
