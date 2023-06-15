import { type Request, type ResponseToolkit, type ServerRoute } from '@hapi/hapi'
import { type SongsCreation, type ServerResponse } from '../app.d'
import SongsModel from '../models/SongsModel'
import validateSongsCreation from '../validators/songsValidator'
import { Op } from 'sequelize'

type SongsResponse = ServerResponse<
{ songId: string } | { songs: any[] } | { song: any }
>

export const createSongRouter: ServerRoute = {
  path: '/songs',
  method: 'POST',
  handler: async (req: Request, h: ResponseToolkit) => {
    if ('invalidResponse' in req.app) return req.app.invalidResponse

    const song: SongsCreation = req.payload as SongsCreation

    const dbResponse = await SongsModel.create(song)
    let response: SongsResponse

    if (!dbResponse.status) {
      response = {
        status: 'fail',
        code: 400,
        message: `Invalid albumId: ${song.albumId} doesn't exist in albums - or Internal Server Error`
      }
    } else {
      response = {
        status: 'success',
        code: 201,
        data: {
          songId: dbResponse.data.songId
        }
      }
    }

    const res = h.response(response).code(response.code)
    res.header('Content-Type', 'application/json')
    res.header(
      'Content-Length',
      String(Buffer.byteLength(JSON.stringify(response), 'utf-8'))
    )

    return res
  },
  options: {
    pre: [{ method: validateSongsCreation }]
  }
}

export const getAllSongsRouter: ServerRoute = {
  path: '/songs',
  method: 'GET',
  handler: async (req: Request, h: ResponseToolkit) => {
    const { performer, title } = req.query as {
      performer: string
      title: string
    }
    const songs = await SongsModel.getAll({
      attributes: ['id', 'title', 'performer'],
      where: {
        [Op.and]: [
          {
            title: {
              [Op.iRegexp]: `^.*${title || ''}.*$`
            }
          },
          {
            performer: {
              [Op.iRegexp]: `^.*${performer || ''}.*$`
            }
          }
        ]
      }
    })

    const response: SongsResponse = {
      status: 'success',
      code: 200,
      data: { songs }
    }
    const res = h.response(response).code(response.code)
    res.header('Content-Type', 'application/json')
    res.header(
      'Content-Length',
      String(Buffer.byteLength(JSON.stringify(response), 'utf-8'))
    )

    return res
  }
}

export const getSongRouter: ServerRoute = {
  path: '/songs/{id}',
  method: 'GET',
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params
    const song = await SongsModel.get(id)
    let response: SongsResponse

    if (song == null) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Song not found'
      }
    } else {
      response = {
        status: 'success',
        code: 200,
        data: {
          song
        }
      }
    }

    const res = h.response(response).code(response.code)
    res.header('Content-Type', 'application/json')
    res.header(
      'Content-Length',
      String(Buffer.byteLength(JSON.stringify(response), 'utf-8'))
    )

    return res
  }
}

export const updateSongRouter: ServerRoute = {
  path: '/songs/{id}',
  method: 'PUT',
  handler: async (req: Request, h: ResponseToolkit) => {
    if ('invalidResponse' in req.app) return req.app.invalidResponse

    const song = req.payload as SongsCreation
    const { id } = req.params
    const dbResponse = await SongsModel.update(song, id)
    let response: SongsResponse

    if (!dbResponse.status) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Song not found'
      }
    } else {
      response = {
        status: 'success',
        code: 200,
        message: dbResponse.data.message
      }
    }
    const res = h.response(response).code(response.code)
    res.header('Content-Type', 'application/json')
    res.header(
      'Content-Length',
      String(Buffer.byteLength(JSON.stringify(response), 'utf-8'))
    )

    return res
  },
  options: {
    pre: [{ method: validateSongsCreation }]
  }
}

export const deleteSongRouter: ServerRoute = {
  path: '/songs/{id}',
  method: 'DELETE',
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params
    const dbResponse = await SongsModel.remove(id)
    let response: SongsResponse

    if (!dbResponse.status) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Song not found'
      }
    } else {
      response = {
        status: 'success',
        code: 200,
        message: dbResponse.data.message
      }
    }
    const res = h.response(response).code(response.code)
    res.header('Content-Type', 'application/json')
    res.header(
      'Content-Length',
      String(Buffer.byteLength(JSON.stringify(response), 'utf-8'))
    )

    return res
  }
}
