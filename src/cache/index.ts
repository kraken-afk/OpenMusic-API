import { createClient } from "redis";
import { AlbumLikesCreation } from "../type";

export default class CacheClientConstructor {
  public isChangedState: Record<string, boolean | null> = {};

  protected createCacheKey(albumId: string): string {
    const key = `${albumId}:cache`;
    return key;
  }

  public setCacheState(): Function {
    const createCacheKey = this.createCacheKey;
    const changhedState = this.isChangedState;

    return (target: unknown, methodKey: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;

      descriptor.value = async function ({
        albumId,
        userId,
      }: AlbumLikesCreation): Promise<void> {
        await method.call(this, { albumId, userId });
        const client = await createCacheClient();
        const key = createCacheKey(albumId);

        changhedState[albumId] = true;

        await client.del(key);
        await client.quit();
      };

      return descriptor;
    };
  }

  public useCache(): Function {
    const createCacheKey = this.createCacheKey;
    const changhedState = this.isChangedState;

    return (target: unknown, methodKey: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;

      descriptor.value = async function (albumId: string): Promise<number> {
        const key = createCacheKey(albumId);
        const client = await createCacheClient();

        if (changhedState[albumId]) {
          const count = await method.call(this, albumId);
          await client.set(key, count);

          // set isChanged to null because a new cache was stored
          changhedState[albumId] = null;
          changhedState.fromCache = false;

          await client.quit();

          return count;
        } else {
          const result = await client.get(key);
          const count = result == null ? 0 : parseInt(result);
          await client.quit();

          changhedState.fromCache = true;
          return count;
        }
      };

      return descriptor;
    };
  }
}

export async function createCacheClient() {
  const { REDIS_SERVER } = process.env;

  const client = createClient({ url: REDIS_SERVER });
  await client.connect();
  return client;
}

export const CacheClient = new CacheClientConstructor();
