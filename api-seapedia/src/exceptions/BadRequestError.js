import { HttpStatus } from "../constants/http-status.js";

export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);

    this.status = HttpStatus.BAD_REQUEST;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.BAD_REQUEST,
      },
    };
  }
}