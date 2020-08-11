#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from './ecr.stack';

const app = new cdk.App();
new EcrStack(app, 'MyStack', { env: { region: 'us-east-2', account: '776387660326' } });
