import { MessageEmbed } from "discord.js";

import NameCommand from "./commands/name.command";
import NPCCommand from "./commands/npc.command";
import WarfareCommand from "./commands/warfare.command";

import { Language, Gender, Race } from "./models/general.models";

import { RACE_HUMAN, RACES } from "./constants/race.constants";
import { LANGUAGES } from "./constants/language.constants";
import { GENDERS } from "./constants/gender.constants";
import {
  COMMAND_NAME,
  COMMAND_NPC,
  COMMAND_PREFIX,
  COMMAND_ARG_COUNT_REGEX,
  COMMAND_WARFARE
} from "./constants/command.constants";

export default class QQClient {
  private nameCommand: NameCommand;
  private npcCommand: NPCCommand;
  private warfareCommand: WarfareCommand;

  private errorMessage = `Woah there, boss! I don't think you're speakin my language. I only understand the following:
    -> \`!qq name\` - This translates in to: create a bunch of random names.
    -> \`!qq npc\` - This translates in to: create a random npc.
  `;

  constructor() {
    this.nameCommand = new NameCommand();
    this.npcCommand = new NPCCommand();
    this.warfareCommand = new WarfareCommand();
  }

  private handleNameCommand(args: string[], argumentCount: number): MessageEmbed {
    if (argumentCount === 0) {
      return this.nameCommand.generateDefaultMessage();
    } else {
      let language: Language;

      const race = RACES.find((nextRace) => args.includes(nextRace)) as Race;
      const gender = GENDERS.find((nextGender) => args.includes(nextGender)) as Gender;
      const count = parseInt(args.find((arg) => COMMAND_ARG_COUNT_REGEX.test(arg))) || 1;

      if (race === RACE_HUMAN) {
        language = LANGUAGES.find((nextLang) => args.includes(nextLang)) as Language;
      }

      return this.nameCommand.generateSpecificMessage(race, gender, language, count);
    }
  }

  private handleNPCCommand(args: string[], argumentCount: number): MessageEmbed {
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

    const name = this.nameCommand.generateNamesWith(race, gender, language, 1);

    return this.npcCommand.generateMessage(name, race, gender);
  }

  private handleWarfareCommand(args: string[], argumentCount: number): MessageEmbed {
    // const name = this.nameCommand.generateNamesWith(race, gender, language, 1);
    const name = "Cool Dudes";

    return this.warfareCommand.generateMessage(name);
  }

  public exec(text: string): string | MessageEmbed {
    const [, argumentList] = text.split(COMMAND_PREFIX);
    const args = argumentList.split(" ").filter((arg) => !!arg);

    if (args.length === 0) {
      return this.errorMessage;
    }

    const command = args.shift();
    const argumentCount = args.length;

    switch (command) {
      case COMMAND_NAME:
        return this.handleNameCommand(args, argumentCount);
      case COMMAND_NPC:
        return this.handleNPCCommand(args, argumentCount);
      case COMMAND_WARFARE:
        return this.handleWarfareCommand(args, argumentCount);
      default:
        return this.errorMessage;
    }
  }
}
