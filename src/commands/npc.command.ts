import { toProperNoun } from "../utilities/qq.utility";

import { Gender, Race, BackgroundCharacteristic, BackgroundIdeal, Ideal } from "../types";

export default class NPCUtility {
  private getRandomCharacteristicFrom(pool: string[] | Ideal[]): string | Ideal {
    const poolSize = pool.length;
    const randomIndex = Math.floor(Math.random() * poolSize);

    return pool[randomIndex];
  }

  private generateRandomAbilityScore(): number {
    const rolledScores = [
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1)
    ];

    return rolledScores.reduce((total, roll) => total + roll, 0);
  }

  private generateAlignment(value: string): string {
    const parsedValue = value.toLowerCase();
    const ATTITUDES = ["lawful", "neutral", "chaotic"];
    const MORALITIES = ["good", "neutral", "evil"];

    if (parsedValue === "any") {
      const attitudeRandomIndex = Math.floor(Math.random() * ATTITUDES.length);
      const moralityRandomIndex = Math.floor(Math.random() * MORALITIES.length);

      return toProperNoun(`${ATTITUDES[attitudeRandomIndex]} ${MORALITIES[moralityRandomIndex]}`);
    } else if (MORALITIES.includes(parsedValue)) {
      const randomIndex = Math.floor(Math.random() * ATTITUDES.length);

      return toProperNoun(`${ATTITUDES[randomIndex]} ${parsedValue}`);
    } else {
      const randomIndex = Math.floor(Math.random() * MORALITIES.length);

      return toProperNoun(`${parsedValue} ${MORALITIES[randomIndex]}`);
    }
  }

  public generateMessage(name: string, race: Race, gender: Gender): string {
    const parsedRace = toProperNoun(race);
    const parsedGender = toProperNoun(gender);

    const titlePool: string[] = require("../../resources/backgrounds/titles.backgrounds.json");

    const bondPool: BackgroundCharacteristic = require("../../resources/backgrounds/bonds.backgrounds.json");
    const flawPool: BackgroundCharacteristic = require("../../resources/backgrounds/flaws.backgrounds.json");
    const traitPool: BackgroundCharacteristic = require("../../resources/backgrounds/traits.backgrounds.json");

    const idealPool: BackgroundIdeal = require("../../resources/backgrounds/ideals.backgrounds.json");

    const title = this.getRandomCharacteristicFrom(titlePool) as string;

    const bond = this.getRandomCharacteristicFrom(bondPool[title]) as string;
    const flaw = this.getRandomCharacteristicFrom(flawPool[title]) as string;
    const ideal = this.getRandomCharacteristicFrom(idealPool[title]) as Ideal;
    const trait = this.getRandomCharacteristicFrom(traitPool[title]) as string;

    const { alignment, name: idealName, description: idealDescription } = ideal;
    const parsedAlignment = this.generateAlignment(alignment);

    const wisdom = this.generateRandomAbilityScore();
    const dexterity = this.generateRandomAbilityScore();
    const strength = this.generateRandomAbilityScore();
    const intelligence = this.generateRandomAbilityScore();
    const charisma = this.generateRandomAbilityScore();
    const constitution = this.generateRandomAbilityScore();

    return `
    Here you go boss! Meet **${name}**

    **General:**
    ${parsedRace} - ${parsedGender}
    ${parsedAlignment} - ${title}

    **Ability Scores:**
    Wisdom: ${wisdom}
    Dexterity: ${dexterity}
    Strength: ${strength}
    Intelligence: ${intelligence}
    Charisma: ${charisma}
    Constitution: ${constitution}

    **Characteristics:**
    *Bond*
    ${bond}

    *Flaw*
    ${flaw}

    *Ideal*
    **${idealName}:** ${idealDescription}

    *Trait*
    ${trait}
    `;
  }
}
