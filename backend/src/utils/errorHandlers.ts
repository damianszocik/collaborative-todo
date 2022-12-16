import { Prisma } from "@prisma/client";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { handleMessageResponse, isExpectedError } from "./responseHandlers";
import { Response } from "express";

export const handleControllerError = (res: Response, error: unknown) => {
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
