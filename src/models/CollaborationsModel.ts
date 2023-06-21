import {
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
} from "../app.d";
import { Playlists, Users, collaborations } from "../config/init";
import ForbiddenError from "../errors/ForbiddenError";
import InternalServerError from "../errors/InternalServerError";
import InvariantError from "../errors/InvariantError";
import NotFoundError from "../errors/NotFoundError";
import { Op } from "sequelize";
import shortid from "shortid";

export interface CollaborationsData {
  collaborationsId: string;
}

export default abstract class CollaborationsModel {
  static async create(
    ownerId: string,
    playlistId: string,
    userIds: string[] | string,
  ): Promise<DatabaseResponse<CollaborationsData>> {
    const playlist = await Playlists.findByPk(playlistId);
    const user = Array.isArray(userIds)
      ? await Users.findAll({ where: { id: { [Op.or]: userIds } }, raw: true })
      : await Users.findByPk(userIds, { raw: true });
    const verificationUser = (() => {
      if (Array.isArray(userIds) && Array.isArray(user)) {
        const illegalUser = userIds.filter((e) => !user.map((e) => e.id).includes(e));
        return () => {
          throw new NotFoundError(
            `Users with id: ${illegalUser.join(", ")} doesn't exist`,
          );
        };
      } else {
        return () => {
          if (user == null) {
            throw new NotFoundError(`User with id: ${userIds} doesn't exist`);
          }
        };
      }
    })();

    if (playlist == null) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    if (playlist.owner !== ownerId) {
      throw new ForbiddenError("Forbiden resource");
    }

    verificationUser();

    try {
      const id = `collaborations-${shortid()}`;
      const users = Array.isArray(userIds) ? userIds : [userIds];
      await collaborations.create({ id, playlistId, userIds: users });
      const response: DatabaseResponsePositive<CollaborationsData> = {
        status: true,
        code: 201,
        data: {
          collaborationsId: id,
        },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 500,
        message: error.message,
      };
      return response;
    }
  }

  static async removeUser(ownerId: string, playlistId: string, userId: string) {
    const playlist = await Playlists.findByPk(playlistId, { raw: true });
    const collaborationPlaylist = await collaborations.findOne({
      where: { playlistId },
      raw: true,
      attributes: ["userIds", "id"],
    });

    if (playlist == null) {
      throw new NotFoundError(`Playlist with id: ${playlistId} doesn't exist`);
    }

    if (playlist.owner !== ownerId) {
      throw new ForbiddenError("Forbiden resource");
    }

    if (collaborationPlaylist == null) {
      throw new InvariantError("Something went Error");
    }

    if (!collaborationPlaylist.userIds.includes(userId)) {
      throw new NotFoundError(`User with id: ${userId} doesn't exist`);
    }

    const removedUsers = [...collaborationPlaylist.userIds].filter(
      (user) => user !== userId,
    );

    const [affectedRow] = await collaborations.update(
      { userIds: removedUsers },
      {
        where: {
          id: collaborationPlaylist.id,
        },
      },
    );

    if (!affectedRow) throw new InternalServerError("Internal server error");
  }
}
