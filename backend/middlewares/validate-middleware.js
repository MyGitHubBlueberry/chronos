import { ValidationError } from "../utils/error.js";

export default function validate(schema) {
    return function(req, res, next) {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new ValidationError('Validation Failed', result.error.flatten());
        }

        req.body = result.data;
        next();
    }
}
