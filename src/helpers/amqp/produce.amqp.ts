import { connect } from "amqplib";
import process from "node:process";

const { RABBITMQ_SERVER } = process.env;

export async function produce(qeue: string, data: object): Promise<void> {
  const connection = await connect(RABBITMQ_SERVER as string);
  const channel = await connection.createChannel();

  await channel.assertQueue(qeue);
  await channel.sendToQueue(qeue, Buffer.from(JSON.stringify(data)));

  setTimeout(() => connection.close(), 500);
}
