#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from './ecr.stack';
import { FargateServiceStack } from './fargate-service.stack';

const app = new cdk.App();
new EcrStack(app, 'EcrStack', { env: { region: 'us-east-2', account: '776387660326' } });
new FargateServiceStack(app, 'FargateApp', { env: { region: 'us-east-2', account: '776387660326' } });
