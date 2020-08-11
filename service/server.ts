/* eslint-disable no-console */
/* eslint-disable import/first */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as express from 'express';
import * as AWSXRay from 'aws-xray-sdk';

const AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWSXRay.captureHTTPsGlobal(require('http'), true);

import axios from 'axios';

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || 'localhost';

const app = express();

app.use(AWSXRay.express.openSegment('MyApp'));

app.get('/', async (req, res) => {
  console.log('Received request...processing');
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
    console.log('Finished processing. Response: ', response.data);
    res.send(response.data);
  } catch (err) {
    res.send(err.message);
  }
});

app.use(AWSXRay.express.closeSegment());

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
