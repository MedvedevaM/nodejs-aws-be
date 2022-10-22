import { UnauthorizedError } from "@utils/errors";
import { APIGatewayIAMAuthorizerResult } from "aws-lambda";

export const handler =  async (event, _context, callback) => {
  try {
    if (event.type !== 'TOKEN') {
      throw new UnauthorizedError('Unauthorized');
    }
  
    const authorizationHeaderSplitted = event.authorizationToken?.split(" ");
    const encodedCredentials =
      authorizationHeaderSplitted[0] === "Basic" ? authorizationHeaderSplitted[1] : null;
  
    if (!encodedCredentials) {
      throw new UnauthorizedError('Authorization header is not provided');
    }
  
    const [username, password] = Buffer.from(encodedCredentials, 'base64').toString().split(':');
  
    const storedPassword = process.env[username];
    const isValid = storedPassword === password;
    if (!storedPassword || !isValid) {
      callback(null, getPolicy(encodedCredentials, event.methodArn, 'Deny'));
    }
  
    callback(null, getPolicy(encodedCredentials, event.methodArn));
  } catch (error) {
    callback(error.message);
  }
};

const getPolicy = (principalId, resource, effect = 'Allow'): APIGatewayIAMAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["execute-api:Invoke"],
        Effect: effect,
        Resource: resource
      }]
  }
});