import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import { ProductWithStockInfo } from "@contracts/Product";
import { errorHandler } from "@errors/errorHandler";
import { createProduct as createProductInDB } from '@db/products';
import { validate } from "./schema";
import { validationErrorHandler } from "@validation";

export const createProduct = async (event: APIGatewayProxyEvent): Promise<ProductWithStockInfo> => {
  const body = JSON.parse(event.body);
  validationErrorHandler(validate(body), validate.errors);
  const { title, description, price, count } = body;
  
  const id = uuidv4();
  const product: ProductWithStockInfo = await createProductInDB({
    id,
    title,
    description,
    price
  }, { 
    product_id: id,
    count
  });
  return product;
};

export const handler: APIGatewayProxyHandler = errorHandler<ProductWithStockInfo>(createProduct);