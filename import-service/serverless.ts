import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
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
