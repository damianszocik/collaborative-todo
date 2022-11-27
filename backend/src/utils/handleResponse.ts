import { Response } from "express";

export const handleMessageResponse = (
  res: Response,
  statusCode: number = 500,
  message: string = "Server error",
  additionalData?: {}
) => {
  return res.status(statusCode).send({ message, ...additionalData });
};

export function isExpectedError(
  unknownError: unknown
): unknownError is { code: number; message: string } {
  return (
    typeof unknownError === "object" &&
    unknownError !== null &&
    "code" in unknownError &&
    "message" in unknownError
  );
}
