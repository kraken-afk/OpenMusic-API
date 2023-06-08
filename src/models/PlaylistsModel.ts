import shortid from "shortid";
import {
  DatabaseResponse,
  DatabaseResponseNegative,
  DatabaseResponsePositive,
  PlaylistCreation,
  Playlist,
} from "../app.d";
import { Playlists, Songs, Users } from "../config/init";
import InvariantError from "../errors/InvariantError";
import NotFoundError from "../errors/NotFoundError";
import { Op, NonNullFindOptions } from "sequelize";
import ForbiddenError from "../errors/ForbiddenError";

type PlaylistWithCredential = {
  ownerId: string;
  playlistId: string;
};

export default abstract class PlaylistsModel {
  static async getPlaylist(
    id: string,
    options: Omit<NonNullFindOptions<any>, "where"> = {
      raw: true,
      rejectOnEmpty: false,
    }
  ) {
    const playlist = await Playlists.findByPk(id, options);

    if (!playlist)
      throw new NotFoundError(`Playlist with id: ${id} doesn't exist`);

    return playlist;
  }

  static async create({
    name,
    owner,
  }: PlaylistCreation): Promise<DatabaseResponse<{ playlistId: string }>> {
    try {
      const id = "playlists-" + shortid();
      if ((await Users.findByPk(owner)) === null)
        throw new InvariantError(`Couldn't found user by id: ${id}`);

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

  static async getAll({
    owner,
  }: Omit<PlaylistCreation, "name">): Promise<Playlist[]> {
    const playlists = await Playlists.findAll({
      where: { owner },
      raw: true,
      attributes: ["id", "name"],
    });
    const user = await Users.findByPk(owner, {
      raw: true,
      attributes: ["username"],
    });

    if (user === null)
      throw new Error(`Couldn't find username of id: ${owner}`);

    return playlists.map(
      (item): Playlist => ({ ...item, username: user.username })
    );
  }

  static async remove(playlistId: string, ownerId: string): Promise<void> {
    const playlist = await Playlists.findByPk(playlistId);

    if (!playlist)
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);

    if (playlist.owner !== ownerId)
      throw new ForbiddenError("Forbiden resource");

    const affectedRow = await Playlists.destroy({ where: { id: playlistId } });
    if (!affectedRow)
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
  }

  static async addSong(
    { ownerId, playlistId }: PlaylistWithCredential,
    songId: string
  ) {
    const playlist = await Playlists.findByPk(playlistId);

    if (!playlist)
      throw new InvariantError(`Playlist with id: ${playlistId} doesn't exist`);

    if (playlist.owner !== ownerId)
      throw new ForbiddenError("Forbiden resource");

    if (!(await Songs.findByPk(songId)))
      throw new NotFoundError(`Song with id: ${songId} doesn't exist`);

    const { songs } = (await Playlists.findOne({
      where: { id: playlistId },
      raw: true,
      attributes: ["songs"],
    })) ?? { songs: [] };

    const newSong = [songs ? songs : [], songId].flat(999);

    const affectedRow = await Playlists.update(
      { songs: newSong },
      { where: { [Op.and]: { id: playlistId, owner: ownerId } } }
    );

    if (!affectedRow) throw new InvariantError("Something went error");
  }

  static async getSongs({ ownerId, playlistId }: PlaylistWithCredential) {
    const playlist = await Playlists.findByPk(playlistId, {
      raw: true,
      attributes: ["songs", "owner"],
    });

    if (!playlist)
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);

    if (playlist.owner !== ownerId)
      throw new ForbiddenError("Forbiden resource");

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

  static async removeSong(
    songId: string,
    { ownerId, playlistId }: PlaylistWithCredential
  ) {
    const playlist = await Playlists.findByPk(playlistId, {
      raw: true,
      attributes: ["songs", "owner"],
    });

    if (!playlist)
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);

    if (playlist.owner !== ownerId)
      throw new ForbiddenError("Forbiden resource");

    if (!playlist.songs.includes(songId))
      throw new NotFoundError(
        `Song with id: ${songId} doesn't exist in playlist with id: ${playlistId}`
      );

    const newSongs = playlist.songs.filter((song) => song !== songId);

    await Playlists.update(
      { songs: newSongs },
      { where: { [Op.and]: { id: playlistId, owner: ownerId } } }
    );
  }
}
