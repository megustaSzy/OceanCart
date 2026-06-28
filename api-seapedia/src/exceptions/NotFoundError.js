import { HttpStatus } from "../constants/http-status.js";

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);

    this.status = HttpStatus.NOT_FOUND;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.NOT_FOUND,
      },
    };
  }
}
