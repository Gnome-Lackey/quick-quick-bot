import { exception } from "console";

import { Gender, Language, Race } from "./types";

export default class QQUtility {
  private DEFAULT_RACE: Race = "human";
  private DEFAULT_LANGUAGE: Language = "english";

  private generateNameList(pool: string[], count: number): string[] {
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

  generateRandomNames(firstNamePool: string[], lastNamePool: string[], count: number): string {
    if (firstNamePool.length * lastNamePool.length < count)
      throw exception("Name pool is smaller than the number of desired names.");

    const firstNames = this.generateNameList(firstNamePool, count);
    const lastNames = this.generateNameList(lastNamePool, count);

    const fullNames = firstNames.map((firstName, index) => `${firstName} ${lastNames[index]}`);

    return fullNames.join(", ");
  }

  generateNamesForRace(
    race: Race,
    gender: Gender,
    language: Language = this.DEFAULT_LANGUAGE,
    count = 1
  ): string {
    const parsedRace = race.toLowerCase();
    const parsedLanguage = language.toLowerCase();
    const parsedGender = gender.toLowerCase();
    const isHuman = parsedRace === this.DEFAULT_RACE;

    const firstNameFilePath = isHuman
      ? `../resources/${parsedRace}.${parsedGender}.${parsedLanguage}.names.json`
      : `../resources/${parsedRace}.${parsedGender}.names.json`;

    const lastNameFilePath = isHuman
      ? `../resources/${parsedRace}.${parsedLanguage}.surnames.json`
      : `../resources/${parsedRace}.surnames.json`;

    const firstNamePool: string[] = require(firstNameFilePath);
    const lastNamePool: string[] = require(lastNameFilePath);

    return this.generateRandomNames(firstNamePool, lastNamePool, count);
  }
}
