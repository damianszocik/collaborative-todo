import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const handleZodValidatationExeptionResponse = (
  error: ZodError,
  res: Response
) => {
  res.status(400);
  if (error.issues[0]?.message) {
    res.json({ message: error.issues[0].message });
  }
  res.send();
};

export const validateRequest =
  ({ body: bodyValidator }: { body: AnyZodObject }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parseResult = bodyValidator.safeParse(req.body);
    if (parseResult.success) {
      req.body = parseResult.data;
      next();
    } else {
      handleZodValidatationExeptionResponse(parseResult.error, res);
    }
  };
