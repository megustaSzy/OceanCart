import { BadRequestError } from '../exceptions/BadRequestError.js';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // Extract zod error messages
        const errors = error.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || error.message;
        next(new BadRequestError(`Validation Error - ${errors}`));
    }
};
