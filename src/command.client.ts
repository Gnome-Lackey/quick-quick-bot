import { Message } from "discord.js";

import NameUtility from "./utilities/name.utility";
import NPCUtility from "./utilities/npc.utility";

import { Language, Gender, Race } from "./types";

import { RACE_HUMAN, RACES } from "./constants/race.constants";
import { LANGUAGES } from "./constants/language.constants";
import { GENDERS } from "./constants/gender.constants";
import {
  COMMAND_NAME,
  COMMAND_NPC,
  COMMAND_PREFIX,
  COMMAND_ARG_COUNT_REGEX,
  COMMAND_PREFIX_REGEX
} from "./constants/command.constants";

export default class CommandClient {
  private message: Message;
  private nameUtility: NameUtility;
  private npcUtility: NPCUtility;

  constructor(message: Message) {
    this.message = message;
    this.nameUtility = new NameUtility();
    this.npcUtility = new NPCUtility();
  }

  private handleInvalidCommand(): void {
    const fullMessage = `Uhhh, boss. I think I lost my marbles there for a second. What was it you wanted me to do?
    I can:
      !qq name - create a bunch of random names for you.
      !qq npc - create a random character with basic stats and characteristics.
    `;

    this.message.channel.send(fullMessage);
  }

  private handleNameCommand(args: string[], argumentCount: number): void {
    if (argumentCount === 0) {
      const fullMessage = this.nameUtility.generateDefaultMessage();

      this.message.channel.send(fullMessage);
    } else {
      let language: Language;

      const race = RACES.find((nextRace) => args.includes(nextRace)) as Race;
      const gender = GENDERS.find((nextGender) => args.includes(nextGender)) as Gender;
      const count = parseInt(args.find((arg) => COMMAND_ARG_COUNT_REGEX.test(arg))) || 1;

      if (race === RACE_HUMAN) {
        language = LANGUAGES.find((nextLang) => args.includes(nextLang)) as Language;
      }

      const fullMessage = this.nameUtility.generateSpecificMessage(race, gender, language, count);

      this.message.channel.send(fullMessage);
    }
  }

  private handleNPCCommand(args: string[], argumentCount: number): void {
    const shouldGenerateRandomMessage = argumentCount === 0;

    let language: Language;

    const race = (shouldGenerateRandomMessage
      ? RACES[Math.floor(Math.random() * RACES.length)]
      : RACES.find((nextRace) => args.includes(nextRace))) as Race;

    const gender = (shouldGenerateRandomMessage
      ? GENDERS[Math.floor(Math.random() * GENDERS.length)]
      : GENDERS.find((nextGender) => args.includes(nextGender))) as Gender;

    if (race === RACE_HUMAN) {
      language = (shouldGenerateRandomMessage
        ? LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)]
        : LANGUAGES.find((nextLang) => args.includes(nextLang))) as Language;
    }

    const name = this.nameUtility.generateNamesWith(race, gender, language, 1);
    const fullMessage = this.npcUtility.generateMessage(name, race, gender);

    this.message.channel.send(fullMessage);
  }

  public exec(): void {
    const text = this.message.content;

    if (!COMMAND_PREFIX_REGEX.test(text)) {
      // Ignore commands that don't begin with the quick-quick command.
      this.handleInvalidCommand();
      return;
    }

    const [, argumentList] = text.split(COMMAND_PREFIX);
    const args = argumentList.split(" ").filter((arg) => !!arg);
    const argumentCount = args.length;

    if (argumentCount === 0) {
      this.handleInvalidCommand();
      return;
    }

    const command = args.shift();

    switch (command) {
      case COMMAND_NAME:
        this.handleNameCommand(args, argumentCount);
        break;
      case COMMAND_NPC:
        this.handleNPCCommand(args, argumentCount);
        break;
      default:
        this.handleInvalidCommand();
        return;
    }
  }
}
