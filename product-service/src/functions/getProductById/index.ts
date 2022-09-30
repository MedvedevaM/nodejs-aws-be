import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { errorHandler } from "@errors/errorHandler";
import { Product, ProductWithStockInfo } from "@contracts/Product";
import { validate } from "./schema";
import { NotFoundError } from "@errors";
import { getProductById as getProductByIdFromDB } from '@db/products';
import { getStockInfoByProductId } from '@db/stockInfo';
import { mapProductWithStockInfo } from "@db/utils";
import { StockInfo } from "@contracts/StockInfo";
import { validationErrorHandler } from '@validation';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<ProductWithStockInfo> => {
  validationErrorHandler(validate(event), validate.errors);

  const { productId } = event.pathParameters;
  const product: Product | null = await getProductByIdFromDB(productId);

  if (!product) {
    throw new NotFoundError(`Product with id ${productId} does not exist.`);

  }
  const stockInfo: StockInfo | null = await getStockInfoByProductId(productId);

  if (!product) {
    throw new NotFoundError(`Stock info was not found for product with id ${productId}.`);

  }
  return mapProductWithStockInfo(product, stockInfo);
};

export const handler: APIGatewayProxyHandler = errorHandler<ProductWithStockInfo>(getProductById);