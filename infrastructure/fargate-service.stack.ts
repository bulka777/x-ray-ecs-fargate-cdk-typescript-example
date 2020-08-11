import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

export class FargateServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ApplicationLoadBalancedFargateService(this, 'ExampleService', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('776387660326.dkr.ecr.us-east-2.amazonaws.com/x-ray-example-ecs-app:latest'),
      },
    });
  }
}
