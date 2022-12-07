import { Prisma } from "@prisma/client";
import { RequestHandler, Response } from "express";
import { prisma } from "utils/db";
import { handleMessageResponse, isExpectedError } from "utils/handleResponse";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const handleControllerError = (res: Response, error: unknown) => {
  let message,
    code = 400;
  if (error instanceof z.ZodError) {
    message = fromZodError(error).message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message =
      typeof error.meta?.cause == "string" ? error.meta?.cause : undefined;
  } else if (isExpectedError(error)) {
    message = error.message;
    code = error.code;
  }
  handleMessageResponse(res, code, message);
};

export const getTodos: RequestHandler = async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
};

export const getSingleTodo: RequestHandler = async (req, res) => {
  try {
    const matchedTodo = await prisma.todo.findUnique({
      where: { id: req.params.id },
    });
    if (!matchedTodo) {
      throw { code: 404, message: "can't find a todo with provided id" };
    }
    res.json(matchedTodo);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createTodo: RequestHandler = async (req, res) => {
  try {
    const createdTodo = await prisma.todo.create({ data: req.body });
    res.status(201).json(createdTodo);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const modifyTodo: RequestHandler = async (req, res) => {
  try {
    const todo = await prisma.todo.update({
      where: { id: req.params.id },
      data: req.body,
    });
    handleMessageResponse(res, 201, "todo updated", {
      todo,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteTodo: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    await prisma.todo.delete({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (error) {
    handleControllerError(res, error);
  }
};
