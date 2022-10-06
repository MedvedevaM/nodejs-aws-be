import { APIGatewayProxyHandler } from "aws-lambda";
import { Product, ProductWithStockInfo } from "@contracts/Product";
import { errorHandler } from "@errors/errorHandler";
import { getProducts } from '@db/products';
import { getStockInfo } from '@db/stockInfo';
import { StockInfo } from "@contracts/StockInfo";
import { mapProductsWithStockInfo } from "@db/utils";


export const getProductsList = async (): Promise<ProductWithStockInfo[]> => {
  const products: Product[] = await getProducts();
  const stockInfo: StockInfo[] = await getStockInfo();
  return mapProductsWithStockInfo(products, stockInfo);
};

export const handler: APIGatewayProxyHandler = errorHandler<Product[]>(getProductsList);