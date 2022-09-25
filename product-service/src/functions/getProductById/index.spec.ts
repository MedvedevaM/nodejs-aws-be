import { mocked } from 'jest-mock';
import { getProductById } from '.';
import { getAPIGatewayProxyEventMock } from "@mocks/APIGateway";
import { BadRequestError, NotFoundError } from "@errors";
import { Product } from "@contracts/Product";
import { getProductById as getProductByIdFromDB } from '@db/products';

jest.mock('@db/products');

const mockedProduct: Product = {
    description: "Zestaw Olej dla dziecka + Naklejki gratis Olini",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Zestaw Olej dla dziecka",
    image: "./mocks/img/olej_dziecko_250_UMED_ZESTAW_s.jpg"
};

describe('getProductById', () => {
    it('Success flow: product id is provided and product exists', async () => {
        mocked(getProductByIdFromDB).mockResolvedValue(mockedProduct);
        const product = await getProductById(getAPIGatewayProxyEventMock({
            pathParameters: {
                productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a1'
            }
        }));
        expect(product).toEqual(expect.objectContaining({
            description: "Zestaw Olej dla dziecka + Naklejki gratis Olini",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
            price: 15,
            title: "Zestaw Olej dla dziecka",
            image: "./mocks/img/olej_dziecko_250_UMED_ZESTAW_s.jpg"
        }));
    });
    it('Product not found flow', async () => {
        mocked(getProductByIdFromDB).mockResolvedValue(undefined);
        expect(async () => {
            await getProductById(getAPIGatewayProxyEventMock({
                pathParameters: {
                    productId: '7567ec4b-b10c-48c5-9345-fc73c48a0000'
                }
            }))
        }).rejects.toThrow(NotFoundError);
    });
    it('Bad request flow: product id is provided, but it`s valid', () => {
        expect(async () => {
            await getProductById(getAPIGatewayProxyEventMock({
                pathParameters: {
                    productId: '192.168.0.1'
                }
            }))
        }).rejects.toThrow(BadRequestError);
    });
});
