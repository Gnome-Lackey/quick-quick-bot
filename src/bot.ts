import { Client as DiscordClient, Message } from "discord.js";

import QQClient from "./client";

import { COMMAND_PREFIX_REGEX } from "./constants/command.constants";

const bot = new DiscordClient();
const client = new QQClient();

bot.once("ready", () => {
  console.log("Howdy boss! Quick-Quick gnome lackey at your service.");
});

bot.on("message", (message: Message) => {
  const text = message.content;

  if (message.author.bot || !COMMAND_PREFIX_REGEX.test(text)) {
    // Ignore messages coming from bots. This also avoids qq talking to itself infinitely.
    return;
  }

  message.channel.send("I'm on it boss!");

  const response = client.exec(text);

  message.channel.send(response);
});

bot.login(process.env.DISCORD_BOT_SECRET);
