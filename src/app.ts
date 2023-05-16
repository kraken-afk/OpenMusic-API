import express, { type Express, type Request, type Response } from 'express';
import { json } from 'body-parser'
import * as http from 'node:http';
import AlbumRouter from './routes/albums';

const app: Express = express();
const hostname = '127.0.0.1';
const port = 5000;

app.use(json());
app.use('/albums', AlbumRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

http.createServer(app)
  .listen(port, hostname, (): void => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
