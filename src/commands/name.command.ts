import { MessageEmbed, EmbedFieldData } from "discord.js";
import { exception } from "console";

import { toProperNoun } from "../utilities/qq.utility";

import { Gender, Language, Race } from "../types";

import { RACE_HUMAN, RACES } from "../constants/race.constants";
import { LANGUAGE_DEFAULT } from "../constants/language.constants";
import { GENDER_FEMALE, GENDER_MALE } from "../constants/gender.constants";

export default class NameUtility {
  private buildEmbedMessage(fields: EmbedFieldData[]): MessageEmbed {
    return new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Quick-Quick Results")
      .setDescription("Hey Boss! I thought of some names for you. Take a look!")
      .addFields(fields)
      .setTimestamp()
      .setFooter("\u00a9 | Gnome Lackey");
  }

  private getRandomNamesFrom(pool: string[], count: number): string[] {
    const names: string[] = [];
    const poolSize = pool.length;

    while (names.length < count) {
      const randomIndex = Math.floor(Math.random() * poolSize);
      const name = pool[randomIndex];

      if (!names.includes(name)) {
        names.push(name);
      }
    }

    return names;
  }

  private buildRandomFullNamesFrom(
    firstNamePool: string[],
    lastNamePool: string[],
    count: number
  ): string {
    if (firstNamePool.length * lastNamePool.length < count)
      throw exception("Name pool is smaller than the number of desired names.");

    const firstNames = this.getRandomNamesFrom(firstNamePool, count);
    const lastNames = this.getRandomNamesFrom(lastNamePool, count);

    const fullNames = firstNames.map((firstName, index) => `${firstName} ${lastNames[index]}`);

    return fullNames.join("\n");
  }

  public generateNamesWith(
    race: Race,
    gender: Gender,
    language: Language = LANGUAGE_DEFAULT,
    count = 1
  ): string {
    const isHuman = race === RACE_HUMAN;

    const firstNameFilePath = isHuman
      ? `../../resources/names/${race}.${gender}.${language}.names.json`
      : `../../resources/names/${race}.${gender}.names.json`;

    const lastNameFilePath = isHuman
      ? `../../resources/surnames/${race}.${language}.surnames.json`
      : `../../resources/surnames/${race}.surnames.json`;

    const firstNamePool: string[] = require(firstNameFilePath);
    const lastNamePool: string[] = require(lastNameFilePath);

    return this.buildRandomFullNamesFrom(firstNamePool, lastNamePool, count);
  }

  public generateSpecificMessage(
    race: Race,
    gender: Gender,
    language: Language = LANGUAGE_DEFAULT,
    count = 1
  ): MessageEmbed {
    const properRace = toProperNoun(race);

    const fields = [];

    if (gender) {
      fields.push({
        name: `${properRace} Names`,
        value: this.generateNamesWith(race, gender, language, count)
      });
    } else {
      fields.push({
        name: "Female Names",
        value: this.generateNamesWith(race, GENDER_FEMALE, language, count)
      });
      fields.push({
        name: "Male Names",
        value: this.generateNamesWith(race, GENDER_MALE, language, count)
      });
    }

    return this.buildEmbedMessage(fields);
  }

  public generateDefaultMessage(): MessageEmbed {
    const femaleNameField = {
      name: "Female Names",
      value: RACES.map(
        (race: Race) => `**${toProperNoun(race)}:** ${this.generateNamesWith(race, GENDER_FEMALE)}`
      ).join("\n")
    };

    const maleNameField = {
      name: "Male Names",
      value: RACES.map(
        (race: Race) => `**${toProperNoun(race)}:** ${this.generateNamesWith(race, GENDER_MALE)}`
      ).join("\n")
    };

    return this.buildEmbedMessage([femaleNameField, maleNameField]);
  }
}
