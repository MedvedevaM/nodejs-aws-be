import { products } from '@mocks/products';
import { Product } from "@contracts/Product";

export const getProductById = (productId: string) => {
  const product: Product | undefined = products.find(product => product.id === productId);
  // mocked till a real db is provided
  return Promise.resolve(product);
}

export const getProducts = () => {
  // mocked till a real db is provided
    return Promise.resolve(products);
}