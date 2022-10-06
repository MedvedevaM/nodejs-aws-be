import { StockInfo } from "@contracts/StockInfo";

export const mapStockInfo = (item): StockInfo => ({
    product_id: item.product_id,
    count: item.count
});