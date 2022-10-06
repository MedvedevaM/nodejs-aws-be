import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        description: {
            type: 'string',
            nullable: true
        },
        price: {
            type: 'number',
            minimum: 0
        },
        count: {
            type: 'number',
            minimum: 0
        }
    },
    required: ['title', 'description', 'price', 'count'],
    additionalProperties: false
};

export const validate = ajv.compile(schema);