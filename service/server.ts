/* eslint-disable no-console */
/* eslint-disable import/first */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as express from 'express';
import * as AWSXRay from 'aws-xray-sdk';
import * as AWS from 'aws-sdk';

const AWSdk = AWSXRay.captureAWS(AWS);
AWSXRay.captureHTTPsGlobal(require('http'), true);
AWSXRay.captureHTTPsGlobal(require('https'), true);

import axios from 'axios';

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || 'localhost';

const app = express();
const sns = new AWSdk.SNS();

app.use(AWSXRay.express.openSegment('MyApp'));

app.get('/', (req, res) => {
  console.log('Healthy!');
  res.status(200);
  res.send({ status: 'Ok' });
});

app.get('/pokemon', async (req, res) => {
  console.log('Received request...processing');
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
    console.log('Finished processing. Response: ', response.data);
    await sns.publish({
      Message: JSON.stringify(response.data),
      TopicArn: 'arn:aws:sns:us-east-2:776387660326:x-ray-example-topic',
    }).promise();
    res.send(response.data);
  } catch (err) {
    res.send(err.message);
  }
});

app.use(AWSXRay.express.closeSegment());

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
