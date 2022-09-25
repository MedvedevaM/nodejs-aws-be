import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { errorHandler } from "@errors/errorHandler";
import { Product } from "@contracts/Product";
import { validate } from "./schema";
import { BadRequestError, NotFoundError } from "@errors";
import { getProductById as getProductByIdFromDB } from '@db/products';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<Product> => {
  const isValid: boolean = validate(event);
  
  if (!isValid) {
    throw new BadRequestError('Provided request data is not valid.');
  }

  const { productId } = event.pathParameters;
  const product: Product | undefined = await getProductByIdFromDB(productId);

  if (!product) {
    throw new NotFoundError(`Product with id ${productId} does not exist.`);

  }
  return product;
};

export const handler: APIGatewayProxyHandler = errorHandler<Product>(getProductById);