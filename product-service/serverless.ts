import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: '${env:PRODUCTS_TABLE}',
      STOCKS_TABLE: '${env:STOCKS_TABLE}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              { "Fn::GetAtt": ["products", "Arn"] },
              { "Fn::GetAtt": ["stocks", "Arn"] },
            ],
          },
        ]
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'src/functions/getProductsList/index.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products'
          },
        },
      ]
    },
    getProductById: {
      handler: 'src/functions/getProductById/index.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}'
          },
        },
      ]
    },
    createProduct: {
      handler: 'src/functions/createProduct/index.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'products'
          },
        },
      ]
    }
  },
  resources: {
    Resources: {
      products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${env:PRODUCTS_TABLE}',
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      stocks: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${env:STOCKS_TABLE}',
          AttributeDefinitions: [
            { AttributeName: "product_id", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "product_id", KeyType: "HASH" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
