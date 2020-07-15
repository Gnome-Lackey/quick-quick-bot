import { exception } from "console";

import { Gender, Language, Race } from "./types";

import { LANGUAGE_DEFAULT, RACE_HUMAN, RACES, GENDER_FEMALE, GENDER_MALE } from "./constants";

export default class QQUtility {
  private toProperNoun(text: string): string {
    const firstLetter = text.charAt(0).toUpperCase();

    return `${firstLetter}${text.slice(1)}`;
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

    return fullNames.join(",\n\t");
  }

  private generateNamesWith(
    race: Race,
    gender: Gender,
    language: Language = LANGUAGE_DEFAULT,
    count = 1
  ): string {
    const parsedRace = race.toLowerCase();
    const parsedLanguage = language.toLowerCase();
    const parsedGender = gender.toLowerCase();
    const isHuman = parsedRace === RACE_HUMAN;

    const firstNameFilePath = isHuman
      ? `../resources/${parsedRace}.${parsedGender}.${parsedLanguage}.names.json`
      : `../resources/${parsedRace}.${parsedGender}.names.json`;

    const lastNameFilePath = isHuman
      ? `../resources/${parsedRace}.${parsedLanguage}.surnames.json`
      : `../resources/${parsedRace}.surnames.json`;

    const firstNamePool: string[] = require(firstNameFilePath);
    const lastNamePool: string[] = require(lastNameFilePath);

    return this.buildRandomFullNamesFrom(firstNamePool, lastNamePool, count);
  }

  generateSpecificMessage(
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

  generateDefaultMessage(): string {
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
