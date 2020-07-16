import { Client, Message } from "discord.js";

import CommandClient from "./command.client";

const qq = new Client();

qq.once("ready", () => {
  console.log("Howdy boss! Quick-quick Gnome Lackey at your service.");
});

qq.on("message", (message: Message) => {
  const commandClient = new CommandClient(message);

  commandClient.exec();
});

qq.login(process.env.DISCORD_BOT_SECRET);
