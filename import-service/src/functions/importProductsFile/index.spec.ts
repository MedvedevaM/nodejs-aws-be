import { mocked } from 'jest-mock';
import { importProductsFile } from '.';
import { getAPIGatewayProxyEventMock } from "../../mocks/APIGateway";
import { S3 } from "aws-sdk";

jest.mock('aws-sdk');

describe('importProductsFile', () => {
    it('Success flow', async () => {
        const mockedSignedUrl = 'testSignedUrl';
        mocked(S3.prototype.getSignedUrlPromise).mockResolvedValue(mockedSignedUrl);
        const signedUrl = await importProductsFile(getAPIGatewayProxyEventMock());
        expect(signedUrl).toEqual(mockedSignedUrl);
    });
});
