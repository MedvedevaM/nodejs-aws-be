import { StockInfo } from "@contracts/StockInfo";

export const mapStockInfo = (item): StockInfo => ({
    product_id: item.id,
    count: item.count
});