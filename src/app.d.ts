export interface ServerResponse<T extends object> {
  status: 'success' | 'fail'
  code: number
  data?: T
  message?: string
}

/// /////////////////////////////////////////
//             Albums Scope              //
/// ///////////////////////////////////////

export interface AlbumsCreation {
  name: string
  year: number
}

export type Album = AlbumsCreation & {
  id: string
  songs?: object[] | undefined
}

export interface DataAlbumCreated { albumId: string }

/// /////////////////////////////////////////
//             Songs Scope               //
/// ///////////////////////////////////////

export interface SongsCreation {
  title: string
  year: number
  genre: string
  performer: string
  duration?: number
  albumId?: string
}

export interface Song {
  id?: string
  title?: string
  year?: number
  performer?: string
  genre?: string
  duration?: number | null
  albumId?: string | null
}

/// /////////////////////////////////////////
//             Users Scope               //
/// ///////////////////////////////////////

export interface UserCreation {
  username: string
  fullname: string
  password: string
}

export interface UserAuth {
  username: string
  password: string
}

/// /////////////////////////////////////////
//           Authentication Scope        //
/// ///////////////////////////////////////

export interface RefreshTokenPayload {
  refreshToken: string | Buffer
}

/// /////////////////////////////////////////
//             Playlists Scope           //
/// ///////////////////////////////////////

export interface PlaylistCreation { name: string, owner: string }

export interface Playlist {
  id: string
  name: string
  username: string
}

export interface RecordPayload {
  userId: string
  songId: string
  playlistId: string
}

export const enum Action {
  ADD = 'add',
  DELETE = 'delete',
}

export interface PlaylistWithCredential {
  ownerId: string
  playlistId: string
}

/// /////////////////////////////////////////
//         Collaborations Scope          //
/// ///////////////////////////////////////

export interface CollaborationCreationPayload {
  playlistId: string
  userId: string
}

/// /////////////////////////////////////////
//             Models Scope              //
/// ///////////////////////////////////////

export interface DatabaseResponsePositive<T extends object> {
  status: true
  code?: number
  data: T
  message?: string
}

export interface DatabaseResponseNegative {
  status: false
  message: string
  code?: number
}

export type DatabaseResponse<T extends object> =
  | DatabaseResponsePositive<T>
  | DatabaseResponseNegative
