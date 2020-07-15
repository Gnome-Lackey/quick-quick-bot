import { Client, Message } from "discord.js";

import NameUtility from "./name.utility";

import { NonHumanRaces } from "./types";

const qq = new Client();
const nameUtility = new NameUtility();

const COMMAND_PREFIX = "qq!";
const COMMAND_PREFIX_REGEX = /^qq!/;
const NON_HUMAN_RACES = ["Dragonborn", "Dwarf", "Elf", "Gnome", "Halfling", "Orc", "Tiefling"];

qq.once("ready", () => {
  console.log("Howdy boss! Quick-quick Gnome Lackey at your service.");
});

qq.on("message", (message: Message) => {
  const text = message.content;

  if (!COMMAND_PREFIX_REGEX.test(text)) {
    // Ignore commands that don't begin with the quick-quick command.
    return;
  }

  message.channel.send(`I'm on it boss!`);

  const [, argumentList] = text.split(COMMAND_PREFIX);
  const args = argumentList.split(" ").filter((arg) => !!arg);
  const argumentCount = args.length;

  if (argumentCount === 0) {
    const femaleNameMessage = NON_HUMAN_RACES.reduce(
      (fullText, race) => `${fullText}
      **${race}:** ${nameUtility.buildNonHumanNames(1, "female", race as NonHumanRaces)}`,
      `*Female Names:*
      **Humans:** ${nameUtility.buildHumanNames(1, "female")}`
    );

    const maleNameMessage = NON_HUMAN_RACES.reduce(
      (fullText, race) => `${fullText}
      **${race}:** ${nameUtility.buildNonHumanNames(1, "male", race as NonHumanRaces)}`,
      `*Male Names:*
      **Humans:** ${nameUtility.buildHumanNames(1, "male")}`
    );

    message.channel.send(femaleNameMessage);
    message.channel.send(maleNameMessage);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
