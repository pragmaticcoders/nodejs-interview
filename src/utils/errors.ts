import { ValidationError } from "class-validator";
import { isNil } from "ramda";

export type HttpErrorResponseBody = { message: string; kind?: string };

export class HttpErrorResponse<
  T extends HttpErrorResponseBody = HttpErrorResponseBody
> extends Error {
  constructor(readonly statusCode: number, readonly body: T) {
    super(body.message);
    Object.setPrototypeOf(this, HttpErrorResponse.prototype);
  }
}

export class TransformError extends Error {
  constructor(readonly message: string, readonly validationErrors: ValidationError[]) {
    super(message);
    Object.setPrototypeOf(this, TransformError.prototype);
  }
}

function getChildrenErrors(parentErrors: ValidationError[], propPath: string) {
  let acc: ValidationError[] = [];
  for (const error of parentErrors) {
    if (error.constraints) {
      acc = acc.concat({ ...error, property: `${propPath}.${error.property}` });
    }
    if (error.children.length) {
      acc = acc.concat(getChildrenErrors(error.children, `${propPath}.${error.property}`));
    }
  }
  return acc;
}

export const parseValidationErrors = (validationErrors: ValidationError[]): string => {
  const acc = getChildrenErrors(validationErrors, "");

  return acc
    .map(error => {
      if (isNil(error.constraints)) {
        return "";
      } else {
        return `${Object.values(error.constraints).join(", ")}`;
      }
    })
    .join(";");
};
