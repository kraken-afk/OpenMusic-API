import {
  Action,
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
  type Playlist,
  type PlaylistCreation,
  type PlaylistWithCredential,
} from "../type";
import { Playlists, Songs, Users, collaborations } from "../config/init";
import ForbiddenError from "../errors/ForbiddenError";
import InvariantError from "../errors/InvariantError";
import NotFoundError from "../errors/NotFoundError";
import { record, removeRecord } from "./PlaylistActivitiesModel";
import { type NonNullFindOptions, Op } from "sequelize";
import shortid from "shortid";

export default abstract class PlaylistsModel {
  static async getPlaylist(
    id: string,
    options: Omit<NonNullFindOptions, "where"> = {
      raw: true,
      rejectOnEmpty: false,
    },
  ) {
    const playlist = await Playlists.findByPk(id, options);

    if (!playlist) {
      throw new NotFoundError(`Playlist with id: ${id} doesn't exist`);
    }

    return playlist;
  }

  static async create({
    name,
    owner,
  }: PlaylistCreation): Promise<DatabaseResponse<{ playlistId: string }>> {
    try {
      const id = `playlists-${shortid()}`;
      if ((await Users.findByPk(owner)) === null) {
        throw new InvariantError(`Couldn't found user by id: ${id}`);
      }

      await Playlists.create({ id, name, owner, songs: null });
      const response: DatabaseResponsePositive<{ playlistId: string }> = {
        status: true,
        code: 201,
        data: {
          playlistId: id,
        },
      };
      return response;
    } catch (error) {
      let response: DatabaseResponseNegative;
      if (error instanceof InvariantError) {
        response = {
          status: false,
          code: error.code,
          message: error.message,
        };
        return response;
      }
      response = {
        status: false,
        code: 500,
        message: "Internal Server Error",
      };
      return response;
    }
  }

  static async getAll({ owner }: Omit<PlaylistCreation, "name">): Promise<Playlist[]> {
    const playlists = await Playlists.findAll({
      where: { owner },
      raw: true,
      attributes: ["id", "name", "owner"],
    });
    const user = await Users.findByPk(owner, {
      raw: true,
      attributes: ["username"],
    });
    const playlistCollaborator = await collaborations.findAll({
      where: {
        userIds: [owner],
      },
      raw: true,
      attributes: ["playlistId"],
    });

    if (user === null) {
      throw new Error(`Couldn't find username of id: ${owner}`);
    }

    const result: Playlist[] = [];

    if (playlistCollaborator.length > 0) {
      const collaborationPlaylist = await Promise.all(
        playlistCollaborator.map(async ({ playlistId }) => {
          const playlist = await Playlists.findByPk(playlistId, {
            raw: true,
            attributes: ["id", "name", "owner"],
          });

          if (playlist == null) return;

          const user = await Users.findByPk(playlist.owner, {
            raw: true,
            attributes: ["username"],
          });

          if (user == null) return;

          return {
            id: playlist.id,
            name: playlist.name,
            username: user.username,
          };
        }),
      );

      const truthyPlaylist = collaborationPlaylist.filter(Boolean) as Playlist[];

      result.push(...truthyPlaylist);
    }

    result.push(
      ...playlists.map(({ id, name }) => ({
        id,
        name,
        username: user.username,
      })),
    );

    return result;
  }

  @removeRecord()
  static async remove(playlistId: string, ownerId: string) {
    const playlist = await Playlists.findByPk(playlistId, { raw: true });

    if (playlist == null) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    const collaborationPlaylist = await collaborations.findOne({
      where: { playlistId: playlist.id },
      raw: true,
    });

    if (playlist.owner !== ownerId) {
      throw new ForbiddenError("Forbiden resource");
    }

    if (collaborationPlaylist != null) {
      await collaborations.destroy({ where: { id: collaborationPlaylist.id } });
    }

    const affectedRow = await Playlists.destroy({ where: { id: playlistId } });

    if (!affectedRow) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }
  }

  @record(Action.ADD)
  static async addSong({ ownerId, playlistId }: PlaylistWithCredential, songId: string) {
    const playlist = await Playlists.findByPk(playlistId, { raw: true });
    const collaborationPlaylist = await collaborations.findOne({
      where: {
        [Op.and]: {
          playlistId,
          userIds: [ownerId],
        },
      },
      raw: true,
    });

    if (playlist == null) {
      throw new InvariantError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    if (playlist.owner !== ownerId && collaborationPlaylist == null) {
      throw new ForbiddenError("Forbiden resource");
    }

    if ((await Songs.findByPk(songId)) == null) {
      throw new NotFoundError(`Song with id: ${songId} doesn't exist`);
    }

    const currentPlaylist = await Playlists.findOne({
      where: { id: playlistId },
      raw: true,
      attributes: ["songs"],
    });

    const newSong = [
      currentPlaylist?.songs != null ? currentPlaylist?.songs : [],
      songId,
    ].flat(999);

    const [affectedRow] = await Playlists.update(
      { songs: newSong },
      { where: { id: playlistId } },
    );

    if (!affectedRow) throw new InvariantError("Something went error");
  }

  static async getSongs({ ownerId, playlistId }: PlaylistWithCredential) {
    const playlist = await Playlists.findByPk(playlistId, {
      raw: true,
      attributes: ["songs", "owner"],
    });
    const collaborationPlaylist = await collaborations.findOne({
      where: {
        [Op.and]: {
          playlistId,
          userIds: [ownerId],
        },
      },
      raw: true,
    });

    if (playlist == null) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    if (playlist.owner !== ownerId && collaborationPlaylist == null) {
      throw new ForbiddenError("Forbiden resource");
    }

    const songs = await Songs.findAll({
      where: {
        id: {
          [Op.or]: playlist.songs,
        },
      },
      attributes: ["id", "title", "performer"],
    });
    return songs;
  }

  @record(Action.DELETE)
  static async removeSong(
    { ownerId, playlistId }: PlaylistWithCredential,
    songId: string,
  ): Promise<void> {
    const playlist = await Playlists.findByPk(playlistId, {
      raw: true,
      attributes: ["songs", "owner"],
    });
    const collaborationPlaylist = await collaborations.findOne({
      where: {
        [Op.and]: {
          playlistId,
          userIds: [ownerId],
        },
      },
      raw: true,
    });

    if (playlist == null) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    if (playlist.owner !== ownerId && collaborationPlaylist == null) {
      throw new ForbiddenError("Forbiden resource");
    }

    if (!playlist.songs.includes(songId)) {
      throw new NotFoundError(
        `Song with id: ${songId} doesn't exist in playlist with id: ${playlistId}`,
      );
    }

    const newSongs = playlist.songs.filter((song) => song !== songId);

    await Playlists.update({ songs: newSongs }, { where: { id: playlistId } });
  }
}
