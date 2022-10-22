import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const db = new DynamoDB.DocumentClient()
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

interface Product {
    id: string,
    title: string,
    description: string,
    price: number,
    image?: string,
}

interface StockInfo {
    product_id: string,
    count: number
}

export const createProduct = async (product): Promise<void> => {
    const id = uuidv4();
    const creationResult = await db.transactWrite({
        TransactItems: [
            {
                Put: {
                    Item: _mapProduct(product, id),
                    TableName: PRODUCTS_TABLE,
                },
            },
            {
                Put: {
                    Item: _mapStockInfo(product, id),
                    TableName: STOCKS_TABLE,
                },
            }
        ]
    }).promise();
    console.log(`Product creation result: ${creationResult}`);
};

const _mapProduct = (product, id): Product => {
    const { title, description, price, image } = product;
    return { id, title, description, price, image };
}

const _mapStockInfo = (product, id): StockInfo => {
    const { count } = product;
    return { product_id: id, count };
}