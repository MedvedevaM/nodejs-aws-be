import { mocked } from 'jest-mock';
import { getProductsList } from '.';
import { Product } from "@contracts/Product";
import { getProducts } from '@db/products';

jest.mock('@db/products');

const mockedProducts: Product[] = [{
    description: "Olej kokosowy",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 24,
    title: "Olej kokosowy",
    image: "./mocks/img/Olej-kokosowy-Olini.jpg"
},
{
    description: "Zestaw Olej dla dziecka + Naklejki gratis Olini",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Zestaw Olej dla dziecka",
    image: "./mocks/img/olej_dziecko_250_UMED_ZESTAW_s.jpg"
},
{
    description: "Miodek Olini",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Miodek Olini",
    image: "./mocks/img/Miod-rzepakowy-z-jagoda-kamczacka,-truskawka-i-malina.jpg"
}];

describe('getProductsList', () => {
    beforeEach(() => {
        mocked(getProducts).mockResolvedValue(mockedProducts);
    });
    it('Success flow: product id is provided and product exists', async () => {
        const products = await getProductsList();
        expect(products.length).toEqual(mockedProducts.length);
    });
});
