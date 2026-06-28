import { HttpStatus } from "../constants/http-status.js";

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);

    this.status = HttpStatus.CONFLICT;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.CONFLICT,
      },
    };
  }
}
