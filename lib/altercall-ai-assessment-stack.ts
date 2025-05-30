import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';

export class S3LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'trigger-storage-bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
    
    // Define the Lambda function
    const s3EventHandler = new lambda.Function(this, 'S3EventHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lib/lambda-event-handler')),
      environment: {
        BUCKET_NAME: bucket.bucketName
      }
    });
    
    // Grant the Lambda function read permissions to the S3 bucket
    bucket.grantRead(s3EventHandler);
    
    // Add event notification for object creation events
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(s3EventHandler)
    );
    
    // Add outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'Name of the S3 bucket'
    });
    
    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: s3EventHandler.functionName,
      description: 'Name of the Lambda function'
    });
  }
}