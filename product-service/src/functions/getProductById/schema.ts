import Ajv from 'ajv';
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: 'object',
    properties: {
        pathParameters: {
            type: 'object',
            properties: {
                productId: { 
                    type: "string",
                    format: "uuid"
                }
            },
            required: ["productId"],
            additionalProperties: false
        },
    },
    required: ['pathParameters'],
    additionalProperties: true,
};

export const validate = ajv.compile(schema);