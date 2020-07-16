import { Client as DiscordClient, Message } from "discord.js";

import QQClient from "./client";

const bot = new DiscordClient();
const client = new QQClient();

bot.once("ready", () => {
  console.log("Howdy boss! Quick-Quick gnome lackey at your service.");
});

bot.on("message", (message: Message) => {
  if (message.author.bot) {
    // Ignore messages coming from bots. This also avoids qq talking to itself infinitely.
    return;
  }

  const fullMessage = client.exec(message.content);

  message.channel.send(fullMessage);
});

bot.login(process.env.DISCORD_BOT_SECRET);
