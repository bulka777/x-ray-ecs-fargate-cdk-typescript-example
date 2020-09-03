import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sub from '@aws-cdk/aws-sns-subscriptions';
import * as sources from '@aws-cdk/aws-lambda-event-sources';
import * as path from 'path';

import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { Repository } from '@aws-cdk/aws-ecr';

export class FargateServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'XRayExampleSqsQueue', { queueName: 'x-ray-example-queue' });
    queue.grantSendMessages(new iam.ServicePrincipal('sns.amazonaws.com'));

    const topic = new sns.Topic(this, 'XRayExampleTopic', { topicName: 'x-ray-example-topic' });
    topic.addSubscription(new sub.SqsSubscription(queue));

    const fn = new lambda.Function(this, 'XRayExampleFunction', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/example-handler')),
      handler: 'handler.processEvent',
      runtime: lambda.Runtime.NODEJS_12_X,
      tracing: lambda.Tracing.ACTIVE,
    });
    fn.addEventSource(new sources.SqsEventSource(queue));
    fn.role?.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess',
    });

    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    taskRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });
    taskRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess',
    });
    const executionRole = new iam.Role(this, 'ExecutionkRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    executionRole.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    });

    topic.grantPublish(taskRole);

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

    const xray = taskDefinition.addContainer('xray', {
      image: ecs.ContainerImage.fromRegistry('amazon/aws-xray-daemon'),
      cpu: 32,
      memoryReservationMiB: 256,
      essential: false,
    });
    xray.addPortMappings({
      containerPort: 2000,
      protocol: ecs.Protocol.UDP,
    });

    new ApplicationLoadBalancedFargateService(this, 'ExampleService', {
      taskDefinition,
    });
  }
}
