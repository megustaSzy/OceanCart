import { HttpStatus } from "../constants/http-status.js";
import { MESSAGE } from "../constants/message.js";

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    
    // If error is an instance of our custom exceptions, it will have err.response
    if (err.response) {
        return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json(err.response);
    }
    
    // Fallback for unexpected errors
    const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || MESSAGE.COMMON.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
        success: false,
        message,
        metadata: {
            status: statusCode
        }
    });
};
