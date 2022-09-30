import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient()
const STOCKS_TABLE = process.env.STOCKS_TABLE;

import { StockInfo } from "@contracts/StockInfo";
import { mapStockInfo } from "./utils";

export const getStockInfoByProductId = async (productId: string): Promise<StockInfo | null> => {
  const { Item } = await db.get({
    TableName: STOCKS_TABLE,
    Key: { product_id: productId }
  }).promise();

  if (!Item) {
    return null;
  }
  return mapStockInfo(Item);
}

export const getStockInfo = async (): Promise<StockInfo[]> => {
  const { Items } = await db.scan({
    TableName: STOCKS_TABLE
  }).promise();
  return Items.map(mapStockInfo);
}