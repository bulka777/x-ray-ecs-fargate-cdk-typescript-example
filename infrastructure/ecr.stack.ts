import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecr';

export class EcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new ecs.Repository(this, 'Repository', { repositoryName: 'example-ecr-repository' });

    repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
  }
}
