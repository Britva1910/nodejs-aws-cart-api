import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { config } from 'dotenv';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

config({ path: path.join(__dirname, '..', '.env') });

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const RDS_HOST = process.env.DB_HOST;
    const RDS_PORT = process.env.DB_PORT;
    const RDS_DB_NAME = process.env.DB_NAME;
    const RDS_USERNAME = process.env.DB_USER;
    const RDS_PASSWORD = process.env.DB_PASSWORD;

    const cartServiceHandler = new lambda.Function(this, 'CardServiceHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '..', '..', 'dist')),
      handler: 'main.handler',
      environment: {
        DB_HOST: RDS_HOST!,
        DB_PORT: RDS_PORT!,
        DB_NAME: RDS_DB_NAME!,
        DB_USER: RDS_USERNAME!,
        DB_PASSWORD: RDS_PASSWORD!,
      },
      timeout: cdk.Duration.seconds(6),
    });

    const api = new RestApi(this, 'CartAPI', {
      restApiName: 'CartAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(cartServiceHandler),
    });

    new cdk.CfnOutput(this, 'CartAPIUrl', {
      value: api.url,
    });
  }
}
