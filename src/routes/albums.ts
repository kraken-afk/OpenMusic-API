import AlbumsModel from '../models/AlbumsModel'
import validateAlbumCreation from '../validators/albumsValidator'
import { type AlbumsCreation, type ServerResponse, type Album } from '../app.d'
import { Buffer } from 'node:buffer'
import type { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi'
import SongsModel from '../models/SongsModel'

type AlbumsResponse = ServerResponse<{ albumId: string } | { album: Album }>

export const getAlbumsRouter: ServerRoute = {
  path: '/albums/{id}',
  method: 'GET',
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params
    const album = await AlbumsModel.get(id)
    let response: AlbumsResponse

    if (album == null) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Album not found'
      }
    } else {
      album.songs = await SongsModel.getAll({
        attributes: ['id', 'title', 'performer'],
        where: { albumId: album.id }
      })
      response = {
        status: 'success',
        code: 200,
        data: {
          album
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

export const createAlbumRouter: ServerRoute = {
  path: '/albums',
  method: 'POST',
  handler: async (req: Request, h: ResponseToolkit) => {
    if ('invalidResponse' in req.app) return req.app.invalidResponse

    const { name, year } = req.payload as AlbumsCreation
    const dbResponse = await AlbumsModel.create({ name, year })
    let response: AlbumsResponse

    if (!dbResponse.status) {
      response = {
        status: 'fail',
        code: 500,
        message: dbResponse.message
      }
    } else {
      response = {
        status: 'success',
        code: 201,
        data: {
          albumId: dbResponse.data.albumId
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
    pre: [{ method: validateAlbumCreation }]
  }
}

export const updateAlbumsRouter: ServerRoute = {
  path: '/albums/{id}',
  method: 'PUT',
  handler: async (req: Request, h: ResponseToolkit) => {
    if ('invalidResponse' in req.app) return req.app.invalidResponse

    const { id } = req.params
    const album = req.payload as AlbumsCreation
    const { status } = await AlbumsModel.update(id, album)
    let response: AlbumsResponse

    if (!status) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Album not found'
      }
    } else {
      response = {
        status: 'success',
        code: 200,
        message: 'Album has been updated'
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
    pre: [{ method: validateAlbumCreation }]
  }
}

export const deleteAlbumsRouter: ServerRoute = {
  path: '/albums/{id}',
  method: 'DELETE',
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params
    const { status } = await AlbumsModel.remove(id)
    let response: AlbumsResponse

    if (!status) {
      response = {
        status: 'fail',
        code: 404,
        message: 'Album not found'
      }
    } else {
      response = {
        status: 'success',
        code: 200,
        message: 'Album has been removed'
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
