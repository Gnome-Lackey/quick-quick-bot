import { Client, Message } from "discord.js";

import QQUtility from "./utility";

const qq = new Client();

const qqCommandRegex = /^qq!/;

qq.once("ready", () => {
  console.log("Howdy boss! Quick-quick Gnome Lackey at your service.");
});

qq.on("message", (message: Message) => {
  const text = message.content;

  if (!qqCommandRegex.test(text)) {
    // Ignore commands that don't begin with the quick-quick command.
    return;
  }

  message.channel.send(`I'm on it boss!`);

  const [, argumentList] = text.split("qq!");
  const args = argumentList.split(" ").filter((arg) => !!arg);
  const argumentCount = args.length;

  if (argumentCount === 0) {
    const maleFirstNames = QQUtility.buildNameListText("../resources/human.male.names.json");
    const femaleFirstNames = QQUtility.buildNameListText("../resources/human.female.names.json");

    message.channel.send(`Male human names: ${maleFirstNames}`);
    message.channel.send(`Female human names: ${femaleFirstNames}`);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
