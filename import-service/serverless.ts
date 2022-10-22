import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      SQS_QUEUE: {
        Ref: 'catalogItemsQueue'
      },
      SNS_TOPIC: {
        Ref: 'createProductTopic'
      },
      PRODUCTS_TABLE: '${env:PRODUCTS_TABLE}',
      STOCKS_TABLE: '${env:STOCKS_TABLE}',
      FIRST_EMAIL: '${env:FIRST_EMAIL}',
      SECOND_EMAIL: '${env:SECOND_EMAIL}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:*"
            ],
            Resource: ['arn:aws:s3:::rss-import-service/*'],
          },
          {
            Effect: "Allow",
            Action: [
              "sqs:*"
            ],
            Resource: [{
              'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
            }],
          },
          {
            Effect: "Allow",
            Action: [
              "sns:*"
            ],
            Resource: {
              Ref: 'createProductTopic'
            },
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:PutItem"
            ],
            Resource: [
              'arn:aws:dynamodb:eu-west-1:*:table/products',
              'arn:aws:dynamodb:eu-west-1:*:table/stocks'
            ],
          },
        ]
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'src/functions/importProductsFile/index.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
          }
        },
      ]
    },
    importFileParser: {
      handler: 'src/functions/importFileParser/index.handler',
      events: [
        {
          s3: {
            bucket: 'rss-import-service',
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: 'uploaded/'
            }],
            existing: true
          },
        },
      ]
    },
    catalogBatchProcess: {
      handler: 'src/functions/catalogBatchProcess/index.handler',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
            }
          }
        },
      ]
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: 'catalogItemsQueue',
        }
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: 'createProductTopic',
        }
      },
      SNSsubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: '${env:FIRST_EMAIL}',
          Protocol: "email",
          TopicArn: {
            Ref: 'createProductTopic'
          }
        }
      },
      SpecialSNSsubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: '${env:SECOND_EMAIL}',
          Protocol: "email",
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            title: ["Special"]
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
