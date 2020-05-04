#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TemplateStack } from '../lib/template-stack';

const app = new cdk.App();
new TemplateStack(app, 'TemplateStack');
