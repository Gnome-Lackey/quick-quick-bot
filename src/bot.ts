import { Client, Message } from "discord.js";

import NameUtility from "./name.utility";

import { Race } from "./types";

const qq = new Client();
const nameUtility = new NameUtility();

const COMMAND_PREFIX = "qq!";
const COMMAND_PREFIX_REGEX = /^qq!/;

const NON_HUMAN_RACES = [
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Halfling",
  "Human",
  "Orc",
  "Tiefling"
];

// const LANGUAGES = [
//   "african",
//   "celtic",
//   "chinese",
//   "egyption",
//   "english",
//   "french",
//   "german",
//   "greek",
//   "indian",
//   "japanese",
//   "mesoamerican",
//   "norse",
//   "polynesian",
//   "roman",
//   "slavic",
//   "spanish"
// ];

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
      (fullText, race: Race) => `${fullText}
      **${race}:** ${nameUtility.generateNamesForRace(race, "female")}`,
      `*Female Names:*`
    );

    const maleNameMessage = NON_HUMAN_RACES.reduce(
      (fullText, race: Race) => `${fullText}
      **${race}:** ${nameUtility.generateNamesForRace(race, "male")}`,
      `*Male Names:*`
    );

    message.channel.send(femaleNameMessage);
    message.channel.send(maleNameMessage);
  } else {
    // const language = args.find((arg) => LANGUAGES.includes(arg));
    // const race = args.find((arg) => [...NON_HUMAN_RACES, "human"].includes(arg));
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
