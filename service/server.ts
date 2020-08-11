import * as express from 'express';

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || 'localhost';

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
