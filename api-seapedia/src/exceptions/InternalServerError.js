import { HttpStatus } from "../constants/http-status.js";

export class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);

    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }
}