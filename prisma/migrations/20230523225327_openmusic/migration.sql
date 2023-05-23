-- CreateTable
CREATE TABLE "albums" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "performer" VARCHAR(255) NOT NULL,
    "genre" VARCHAR(255) NOT NULL,
    "duration" INTEGER,
    "albumId" VARCHAR(255),

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_album_id_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
