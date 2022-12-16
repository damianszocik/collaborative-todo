import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const handleZodValidatationExeptionResponse = (
  error: ZodError,
  res: Response
) => {
  res.status(400);
  const { message } = fromZodError(error);
  res.json({ message }).send();
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
