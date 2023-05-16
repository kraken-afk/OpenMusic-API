import { PrismaClient } from '@prisma/client';
import { Album, AlbumsCreation, DataAlbumCreated, DatabaseResponseNegative, DatabaseResponsePositive } from '../app.d';
import PrismaScheme from '../config/PrismaScheme';
import shortid from 'shortid';

export default abstract class AlbumsModel {
  static async create(data: AlbumsCreation): Promise<DatabaseResponsePositive<DataAlbumCreated> | DatabaseResponseNegative> {
    const prisma = new PrismaClient(PrismaScheme);
    const id = shortid.generate();

    try {
      await prisma.albums.create({ data: { ...data, id } });
      const response: DatabaseResponsePositive<DataAlbumCreated> = {
        status: true,
        data: {
          albumId: id
        }
      };

      return response;
    } catch (error) {
      console.error(error);
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message ?? 'Unable to create album, something went Error!'
      };

      return response;
    } finally {
      prisma.$disconnect();
    }
  }

  static async get(id: string): Promise<Album | null>  {
    const prisma = new PrismaClient(PrismaScheme);
    const album: Album | null = await prisma.albums.findUnique({
      where: { id }
    });
    prisma.$disconnect();
    return album;
  }
}