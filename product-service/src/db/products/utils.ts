import { Product } from "@contracts/Product";

export const mapProduct = (item): Product => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
});