import process from "node:process";
import { type ConsumeMessage, connect } from "amqplib";
import { RABBITMQ_QEUE } from "../src/config/global";
import { config } from "dotenv";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import PlaylistsModel from "../src/models/PlaylistsModel";
import SongsModel from "../src/models/SongsModel";
import InternalServerError from "../src/errors/InternalServerError";

config();
start();

async function start(): Promise<void> {
  const { RABBITMQ_SERVER } = process.env;
  const connection = await connect(RABBITMQ_SERVER as string);
  const channel = await connection.createChannel();

  await channel.assertQueue(RABBITMQ_QEUE);
  await channel.consume(RABBITMQ_QEUE, onMessageHandler, { noAck: true });

  setTimeout(() => connection.close(), 500);
}

async function onMessageHandler(msg: ConsumeMessage | null) {
  if (!msg) throw new InternalServerError("Error occurred while sending email");

  const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
  const { target, id } = JSON.parse(msg.content.toString("utf-8"));
  const transport = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    requireTLS: true,
    secure: false,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  } as SMTPTransport.Options);
  const playlist = await PlaylistsModel.getPlaylist(id);
  const songs = await SongsModel.getAll({ where: { id: playlist.songs } });
  const response = {
    playlist: {
      id: playlist.id,
      name: playlist.name,
      songs: songs.map(({ id, title, performer }) => ({ id, title, performer })),
    },
  };

  transport.sendMail(
    {
      from: "openmusic@api",
      to: target,
      subject: "Your playlist JSON file.",
      text: `Here's your playlist export request.\nPlaylist ID: "${playlist.id}"`,
      attachments: [
        {
          filename: `${playlist.id}.json`,
          content: JSON.stringify(response),
          contentType: "application/json",
        },
      ],
    },
    (err, info) => {
      if (err) console.error("Error occurred while sending email:", err);
      else console.info("Email sent successfully!", info.response);
    },
  );
}
