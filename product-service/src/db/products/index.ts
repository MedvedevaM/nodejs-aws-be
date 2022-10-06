import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient()
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

import { Product, ProductWithStockInfo } from "@contracts/Product";
import { StockInfo } from "@contracts/StockInfo";
import { mapProduct } from "./utils";
import { mapProductWithStockInfo } from "@db/utils";

export const getProductById = async (id: string): Promise<Product | null> => {
  const { Item } = await db.get({
    TableName: PRODUCTS_TABLE,
    Key: { id }
  }).promise();

  if (!Item) {
    return null;
  }
  return mapProduct(Item);
}

export const getProducts = async (): Promise<Product[]> => {
  const { Items } = await db.scan({
    TableName: PRODUCTS_TABLE
  }).promise();
  return Items.map(mapProduct);
}

export const createProduct = async (product: Product, stockInfo: StockInfo): Promise<ProductWithStockInfo> => {
  await db.transactWrite({
    TransactItems: [
      {
        Put: {
          Item: product,
          TableName: PRODUCTS_TABLE,
        },
      },
      {
        Put: {
          Item: stockInfo,
          TableName: STOCKS_TABLE,
        },
      }
    ]
  }).promise();
  return mapProductWithStockInfo(product, stockInfo);
}