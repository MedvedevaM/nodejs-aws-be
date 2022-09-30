import { APIGatewayProxyHandler } from "aws-lambda";
import { Product } from "@contracts/Product";
import { errorHandler } from "@errors/errorHandler";
import { getProducts } from '@db/products';


export const getProductsList = async (): Promise<Product[]> => {
  const products: Product[] = await getProducts();
  return products;
};

export const handler: APIGatewayProxyHandler = errorHandler<Product[]>(getProductsList);