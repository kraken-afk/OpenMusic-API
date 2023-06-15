import shortid from 'shortid'
import { Activities, Playlists } from '../config/init'
import { type Action, type RecordPayload, type PlaylistWithCredential } from '../app.d'
import InternalServerError from '../errors/InternalServerError'
import NotFoundError from '../errors/NotFoundError'
import ForbiddenError from '../errors/ForbiddenError'

export default abstract class PlaylistActivitesModel {
  static async add (
    { userId, songId, playlistId }: RecordPayload,
    action: Action
  ) {
    try {
      const id = 'activities-' + shortid()
      await Activities.create({ id, userId, songId, playlistId, action })
    } catch (error) {
      throw new InternalServerError('Internal server error.')
    }
  }

  static async remove (playlistId: string) {
    const playlist = await Playlists.findByPk(playlistId)

    if (playlist == null) { throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`) }

    await Activities.destroy({ where: { playlistId } })
  }

  static async get (playlistId: string, credentialId: string) {
    const playlist = await Playlists.findByPk(playlistId, { raw: true })

    if (playlist == null) { throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`) }

    if (playlist.owner !== credentialId) { throw new ForbiddenError('Forbiden resource') }

    const activities = await Activities.findAll({
      where: { playlistId },
      raw: true
    })

    return activities
  }
}

export function record (action: Action): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value

    descriptor.value = async function (
      { ownerId, playlistId }: PlaylistWithCredential,
      songId: string
    ) {
      await method.call(this, { ownerId, playlistId }, songId)
      await PlaylistActivitesModel.add(
        { userId: ownerId, playlistId, songId },
        action
      )
    }

    return descriptor
  }
}

export function removeRecord (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any {
  return function (
    target: any,
    methodKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value

    descriptor.value = async function (playlistId: string, ownerId: string) {
      await PlaylistActivitesModel.remove(playlistId)
      await method(playlistId, ownerId)
    }

    return descriptor
  }
}