import { Client, Message } from "discord.js";

import NameUtility from "./name.utility";

import { Race, Language, Gender } from "./types";

const qq = new Client();
const nameUtility = new NameUtility();

const COMMAND_PREFIX = "qq!";
const COMMAND_PREFIX_REGEX = /^qq!/;

const RACES = ["Dragonborn", "Dwarf", "Elf", "Gnome", "Halfling", "Human", "Orc", "Tiefling"];
const GENDERS = ["male", "female"];
const LANGUAGES = [
  "african",
  "celtic",
  "chinese",
  "egyption",
  "english",
  "french",
  "german",
  "greek",
  "indian",
  "japanese",
  "mesoamerican",
  "norse",
  "polynesian",
  "roman",
  "slavic",
  "spanish"
];

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
    const femaleNameMessage = RACES.reduce(
      (fullText, race: Race) => `${fullText}
      **${race}:** ${nameUtility.generateNamesForRace(race, "female")}`,
      `*Female Names:*`
    );

    const maleNameMessage = RACES.reduce(
      (fullText, race: Race) => `${fullText}
      **${race}:** ${nameUtility.generateNamesForRace(race, "male")}`,
      `*Male Names:*`
    );

    message.channel.send(femaleNameMessage);
    message.channel.send(maleNameMessage);
  } else {
    let language: Language;

    const race = RACES.find((nextRace) => args.includes(nextRace.toLowerCase())) as Race;
    const gender = GENDERS.find((nextGender) => args.includes(nextGender.toLowerCase())) as Gender;
    const count = parseInt(args.find((arg) => /^[0-9]$/.test(arg))) || 1;

    if (race.toLowerCase() === "human") {
      language = LANGUAGES.find((nextLang) => args.includes(nextLang.toLowerCase())) as Language;
    }

    const fullMessage = gender
      ? `**${race} Names:** ${nameUtility.generateNamesForRace(race, gender, language, count)}`
      : `
        **${race} Names:**
      *Female Names:* ${nameUtility.generateNamesForRace(race, "female", language, count)}
      *Male Names:* ${nameUtility.generateNamesForRace(race, "male", language, count)}`;

    message.channel.send(fullMessage);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
