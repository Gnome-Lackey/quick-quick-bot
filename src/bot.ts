import { Client, Message } from "discord.js";

import NameUtility from "./name.utility";

import {
  COMMAND_PREFIX,
  COMMAND_PREFIX_REGEX,
  RACES,
  GENDERS,
  COUNT_REGEX,
  RACE_HUMAN,
  LANGUAGES
} from "./constants";

import { Language, Race, Gender } from "./types";

const qq = new Client();
const nameUtility = new NameUtility();

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
    const fullMessage = nameUtility.generateDefaultMessage();

    message.channel.send(fullMessage);
  } else {
    let language: Language;

    const race = RACES.find((nextRace) => args.includes(nextRace)) as Race;
    const gender = GENDERS.find((nextGender) => args.includes(nextGender)) as Gender;
    const count = parseInt(args.find((arg) => COUNT_REGEX.test(arg))) || 1;

    if (race === RACE_HUMAN) {
      language = LANGUAGES.find((nextLang) => args.includes(nextLang)) as Language;
    }

    const fullMessage = nameUtility.generateSpecificMessage(race, gender, language, count);

    message.channel.send(fullMessage);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
