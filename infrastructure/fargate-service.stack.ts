import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { Repository } from '@aws-cdk/aws-ecr';

export class FargateServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    taskRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });
    const executionRole = new iam.Role(this, 'ExecutionkRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    executionRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });

    const taskDefinition = new ecs.TaskDefinition(this, 'TaskDefinition', {
      taskRole,
      executionRole,
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '1024',
      memoryMiB: '2048',
    });

    const nodeServiceContainer = taskDefinition.addContainer('MainService', {
      image: ecs.RepositoryImage.fromEcrRepository(
        Repository.fromRepositoryName(this, 'EcrRepo', 'x-ray-example-ecs-app'),
      ),
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'NodeApp',
      }),
    });
    nodeServiceContainer.addPortMappings({
      containerPort: 80,
    });

    new ApplicationLoadBalancedFargateService(this, 'ExampleService', {
      taskDefinition,
    });
  }
}
