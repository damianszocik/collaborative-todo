import { RequestHandler } from "express";
import { prisma } from "utils/db";
import { handleControllerError } from "utils/errorHandlers";

export const createTodoItem: RequestHandler = async (req, res) => {
  try {
    const createdTodoItem = await prisma.todoItem.create({ data: req.body });
    res.status(201).send(createdTodoItem);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteTodoItem: RequestHandler = async (req, res) => {
  try {
    await prisma.todoItem.delete({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const modifyTodoItem: RequestHandler = async (req, res) => {
  try {
    const modifiedTodoItem = await prisma.todoItem.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).send(modifiedTodoItem);
  } catch (error) {
    handleControllerError(res, error);
  }
};
