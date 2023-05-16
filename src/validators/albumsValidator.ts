import { type Request, type Response } from 'express';
import type { AlbumsCreation, AlbumsResponse } from '../app.d';

export default function validateAlbumCreation(req: Request, res: Response, next: CallableFunction): void {
  const payload: AlbumsCreation = req.body;

  if (('name' in payload) && ('year' in payload))
    if (typeof payload.name === 'string' && typeof payload.year === 'number')
      next();
    else {
      console.log('validator send');
      const { stringify: s } = JSON;
      const response: AlbumsResponse = {
        status: 'fail',
        code: 400,
        message: 'Invalid request body. Name<string> and Year<number> are required.'
      };


      res.setHeader('Content-Type', 'application/json')
        .setHeader('Content-Length', Buffer.byteLength(s(response), 'utf-8'))
        .status(400)
        .send(s(response));
    }
}