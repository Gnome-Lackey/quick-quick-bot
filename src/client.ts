import { MessageEmbed } from "discord.js";

import NameCommand from "./commands/name.command";
import NPCCommand from "./commands/npc.command";
import WarfareCommand from "./commands/warfare.command";

import { Language, Gender, Race } from "./models/general.models";
import {
  WarfareExperienceType,
  WarfareSizeType,
  WarfareUnitType,
  WarfareEquipmentType,
  WarfareAncestryType
} from "./models/warfare.models";

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
import {
  WARFARE_ANCESTRY,
  WARFARE_EQUIPMENT,
  WARFARE_TYPE,
  WARFARE_SIZE,
  WARFARE_EXP
} from "./constants/warfare.constants";

export default class QQClient {
  private nameCommand: NameCommand;
  private npcCommand: NPCCommand;
  private warfareCommand: WarfareCommand;

  private errorMessage = `Woah there, boss! I don't think you're speakin my language. I only understand the following:
    -> \`!qq name\` - This translates in to: create a bunch of random names.
    -> \`!qq npc\` - This translates in to: create a random npc.
    -> \`!qq warfare\` - This translates in to: create a random warfare unit for MCDM's warfare rules.
  `;

  constructor() {
    this.nameCommand = new NameCommand();
    this.npcCommand = new NPCCommand();
    this.warfareCommand = new WarfareCommand();
  }

  private parseInput(
    hasArguments: boolean,
    listOfValues: string[],
    listOfArguments: string[]
  ): string {
    let value: string;

    if (hasArguments) {
      value = listOfValues.find((nextAncestry) => listOfArguments.includes(nextAncestry));
    }

    return value || listOfValues[Math.floor(Math.random() * listOfValues.length)];
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
    const hasArgs = argumentCount > 0;

    let language: Language;

    const race = this.parseInput(hasArgs, RACES, args) as Race;
    const gender = this.parseInput(hasArgs, GENDERS, args) as Gender;

    if (race === RACE_HUMAN) {
      language = this.parseInput(hasArgs, LANGUAGES, args) as Language;
    }

    const name = this.nameCommand.generateNamesWith(race, gender, language, 1);

    return this.npcCommand.generateMessage(name, race, gender);
  }

  private handleWarfareCommand(args: string[], argumentCount: number): MessageEmbed {
    const hasArgs = argumentCount > 0;

    const ancestry = this.parseInput(hasArgs, WARFARE_ANCESTRY, args) as WarfareAncestryType;
    const equipment = this.parseInput(hasArgs, WARFARE_EQUIPMENT, args) as WarfareEquipmentType;
    const exp = this.parseInput(hasArgs, WARFARE_EXP, args) as WarfareExperienceType;
    const size = this.parseInput(hasArgs, WARFARE_SIZE, args) as WarfareSizeType;
    const type = this.parseInput(hasArgs, WARFARE_TYPE, args) as WarfareUnitType;

    return this.warfareCommand.generateMessage(ancestry, equipment, exp, size, type);
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
