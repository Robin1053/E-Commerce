import express from 'express';
import * as path from 'path';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.all('/api/auth/*', toNodeHandler(auth));

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});



server.on('error', console.error);
