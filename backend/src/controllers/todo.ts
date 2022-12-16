import { RequestHandler } from "express";
import { prisma } from "utils/db";
import { handleControllerError } from "utils/errorHandlers";
import { handleMessageResponse } from "utils/responseHandlers";

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
