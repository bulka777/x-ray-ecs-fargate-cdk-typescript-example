# Example for ECS Fargate Service with X-Ray

This project is an example of how ECS Fargate can be set up with X-Ray Daemon and instrumented to collect traces across the system. This is used to support the article here: https://medium.com/@timur137/x-ray-vision-fbeee441748

## Structure
* `infrastructure` folder has all the cdk related constructs. For ECS Fargate, we need to be able to use to store our docker image somewhere, so this folder 
contains both the ECR stack for storing an image in AWS Repo and the Fargate stack to define all other components. You might also find other resources like SNS and 
SQS to support tracing example
* `service` defines a potential ECS fargate service


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
