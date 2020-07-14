import { exception } from "console";

import { Genders, HumanLanguages, HumanNames, NameList, NonHumanRaces } from "./types";

export default class QQUtility {
  private DEFAULT_LANGUAGE: HumanLanguages = "english";

  private generateNameList(pool: NameList, count: number): NameList {
    const names: NameList = [];
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

  generateRandomNames(firstNamePool: NameList, lastNamePool: NameList, count: number): string {
    if (firstNamePool.length * lastNamePool.length < count)
      throw exception("Name pool is smaller than the number of desired names.");

    const firstNames = this.generateNameList(firstNamePool, count);
    const lastNames = this.generateNameList(lastNamePool, count);

    const fullNames = firstNames.map((firstName, index) => `${firstName} ${lastNames[index]}`);

    return fullNames.join(", ");
  }

  buildHumanNames(
    count: number,
    gender: Genders,
    language: HumanLanguages = this.DEFAULT_LANGUAGE
  ): string {
    const firstNames: HumanNames = require(`../resources/human.${gender.toLowerCase()}.names.json`);
    const firstNamePool: NameList = firstNames[language];

    const lastNames: HumanNames = require("../resources/human.surnames.json");
    const lastNamePool: NameList = lastNames[language];

    return this.generateRandomNames(firstNamePool, lastNamePool, count);
  }

  buildNonHumanNames(count: number, gender: Genders, race: NonHumanRaces): string {
    const firstNamePool: NameList = require(`../resources/${race.toLowerCase()}.${gender.toLowerCase()}.names.json`);
    const lastNamePool: NameList = require(`../resources/${race.toLowerCase()}.surnames.json`);

    return this.generateRandomNames(firstNamePool, lastNamePool, count);
  }
}
