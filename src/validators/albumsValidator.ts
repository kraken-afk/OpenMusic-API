import { type Request, type Response } from 'express';
import type { AlbumsResponse } from '../app.d';

export default function validateAlbumCreation(req: Request, res: Response, next: CallableFunction): void {
  const payload = req.body;

  if (('name' in payload) && ('year' in payload) && (typeof payload.name === 'string' && !isNaN(parseInt(payload.year))))
    next();
  else {
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