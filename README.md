# OpenMusic-API
Assignment for Dicoding back-end fundamental class.

## How it works?
It's basically a REST API where users can add songs, albums, and playlists, as well as make playlist collaborations. Users must log in to create playlists. I'm using JWT-based authentication to track the credentials of each activity and record every activity in the playlist. Users can export their activity to email, and the server will send an email to the user with an attached JSON file.

## Built with
- TypeScript
  * A language used for create this project
- Hapi Framework
  * back-end framework.
- Sequelize
  * database ORM
- PostgreSQL
  * Database server
- NodeJs
  * Runtime environment
- Redis
  * Server-side caching
