import { exception } from "console";

import QQUtility from "./qq.utility";

import { Gender, Language, Race } from "../types";

import { RACE_HUMAN, RACES } from "../constants/race.constants";
import { LANGUAGE_DEFAULT } from "../constants/language.constants";
import { GENDER_FEMALE, GENDER_MALE } from "../constants/gender.constants";

export default class NameUtility extends QQUtility {
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

    return fullNames.join(",\n\t");
  }

  public generateNamesWith(
    race: Race,
    gender: Gender,
    language: Language = LANGUAGE_DEFAULT,
    count = 1
  ): string {
    const isHuman = race === RACE_HUMAN;

    const firstNameFilePath = isHuman
      ? `../resources/${race}.${gender}.${language}.names.json`
      : `../resources/${race}.${gender}.names.json`;

    const lastNameFilePath = isHuman
      ? `../resources/${race}.${language}.surnames.json`
      : `../resources/${race}.surnames.json`;

    const firstNamePool: string[] = require(firstNameFilePath);
    const lastNamePool: string[] = require(lastNameFilePath);

    return this.buildRandomFullNamesFrom(firstNamePool, lastNamePool, count);
  }

  public generateSpecificMessage(
    race: Race,
    gender: Gender,
    language: Language = LANGUAGE_DEFAULT,
    count = 1
  ): string {
    const properRace = this.toProperNoun(race);

    return gender
      ? `**${properRace} Names:**\n\t${this.generateNamesWith(race, gender, language, count)}`
      : `**Female ${properRace} Names:**\n\t${this.generateNamesWith(
          race,
          GENDER_FEMALE,
          language,
          count
        )}\n**Male ${properRace} Names:**\n\t${this.generateNamesWith(
          race,
          GENDER_MALE,
          language,
          count
        )}`;
  }

  public generateDefaultMessage(): string {
    const femaleNameMessage = RACES.reduce(
      (fullText, race: Race) => `${fullText}
      **${this.toProperNoun(race)}:** ${this.generateNamesWith(race, GENDER_FEMALE)}`,
      `*Female Names:*`
    );

    const maleNameMessage = RACES.reduce(
      (fullText, race: Race) => `${fullText}
      **${this.toProperNoun(race)}:** ${this.generateNamesWith(race, GENDER_MALE)}`,
      `*Male Names:*`
    );

    return `${femaleNameMessage}\n${maleNameMessage}`;
  }
}
