////////////////////////////////////////////
//             Albums Scope              //
//////////////////////////////////////////

export type AlbumsResponse = {
  status: 'success' | 'fail',
  code: number,
  data?: { albumId: string } | { album: Album },
  message?: string,
};

export type AlbumsCreation = {
  name: string,
  year: number,
};

export type Album = AlbumsCreation & { id: string }

export type DataAlbumCreated = { albumId: string };

////////////////////////////////////////////
//             Models Scope              //
//////////////////////////////////////////

export type DatabaseResponsePositive<T extends Object> = { status: true, data: T };

export type DatabaseResponseNegative = { status: false, message: string };