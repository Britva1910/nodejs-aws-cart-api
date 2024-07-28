import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cardServiceHandler = new lambda.Function(this, 'CardServiceHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '..', '..', 'dist')),
      handler: 'main.handler',
      environment: {},
    });

    const api = new apigateway.RestApi(this, 'CardServiceAPI', {
      restApiName: 'Card Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    const cardResource = api.root.addResource('card');
    const cardLambdaIntegration = new apigateway.LambdaIntegration(
      cardServiceHandler,
    );
    cardResource.addMethod('GET', cardLambdaIntegration);
    cardResource.addMethod('POST', cardLambdaIntegration);
  }
}
