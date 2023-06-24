import { Albums, UserAlbumLikes, Users } from "../config/init";
import { AlbumLikesCreation } from "../type";
import NotFoundError from "../errors/NotFoundError";
import InvariantError from "../errors/InvariantError";

export default abstract class UserAlbumLikesModel {
  static async add({ albumId, userId }: AlbumLikesCreation): Promise<void> {
    const album = await Albums.findByPk(albumId);
    const user = await Users.findByPk(userId);

    if (!album) throw new NotFoundError(`Album with id: ${albumId} doesn't exist`);
    if (!user) throw new NotFoundError(`User with id: ${userId} doesn't exist`);

    const [scheme, isCreated] = await UserAlbumLikes.findOrCreate({
      where: { albumId },
      raw: true,
    });

    if (!isCreated && scheme.usersId.includes(userId))
      throw new InvariantError("User only allowed to like once");

    if (isCreated)
      await UserAlbumLikes.update({ usersId: [userId] }, { where: { albumId } });
    else
      await UserAlbumLikes.update(
        { usersId: [...scheme.usersId, userId] },
        { where: { albumId } },
      );

    // @ts-ignore
    await Albums.update({ likeCount: +album.likeCount + 1 }, { where: { id: albumId } });
  }

  static async delete({ albumId, userId }: AlbumLikesCreation): Promise<void> {
    const album = await Albums.findByPk(albumId);
    const user = await Users.findByPk(userId);

    if (!album) throw new NotFoundError(`Album with id: ${albumId} doesn't exist`);
    if (!user) throw new NotFoundError(`User with id: ${userId} doesn't exist`);

    const scheme = await UserAlbumLikes.findByPk(albumId)

    if (!scheme || !scheme.usersId.includes(userId))
      throw new NotFoundError(`${userId} haven't like ${albumId}`);

      await UserAlbumLikes.update(
        { usersId: scheme.usersId.filter((user) => user !== userId) },
        { where: { albumId } },
      );


    // @ts-ignore
    await Albums.update({ likeCount: +album.likeCount - 1 }, { where: { id: albumId } });
  }
}
