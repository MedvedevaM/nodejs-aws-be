import { BadRequestError } from "@errors";
export const validationErrorHandler = (isValid: boolean, errors) => {
    if (!isValid) {
        console.log(errors);
        throw new BadRequestError('Provided request data is not valid.');
    }
}