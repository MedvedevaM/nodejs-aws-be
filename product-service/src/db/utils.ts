import { Product, ProductWithStockInfo } from "@contracts/Product";
import { StockInfo } from "@contracts/StockInfo";

export const mapProductWithStockInfo = (product: Product, stockInfo: StockInfo): ProductWithStockInfo => ({
    ...product,
    count: stockInfo?.count || 0
});

export const mapProductsWithStockInfo = (products: Product[], stockInfo: StockInfo[]): ProductWithStockInfo[] => {
    const stockInfoMap = new Map(stockInfo.map(info => [info.product_id, info]));
    return products.map(product => mapProductWithStockInfo(product, stockInfoMap.get(product.id)));
}