import { SQSEvent } from 'aws-lambda';
import log = require('lambda-log');

export async function processEvent(event: SQSEvent): Promise<void> {
  log.info('Received the following eent: ', event);
}
