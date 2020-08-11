import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';

export class ClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ecs.Cluster(this, 'Cluster', { clusterName: 'example-cluster' });
  }
}
