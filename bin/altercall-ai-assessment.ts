import * as cdk from 'aws-cdk-lib';
import { S3LambdaStack } from '../lib/altercall-ai-assessment-stack';

const app = new cdk.App();

// Create a single stack containing both S3 and Lambda
new S3LambdaStack(app, 'S3LambdaStack');