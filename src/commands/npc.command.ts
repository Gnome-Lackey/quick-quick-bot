import { toProperNoun } from "../utilities/qq.utility";

import { Gender, Race } from "../types";

export default class NPCUtility {
  private getRandomCharacteristicFrom(pool: string[]): string {
    const poolSize = pool.length;
    const randomIndex = Math.floor(Math.random() * poolSize);

    return pool[randomIndex];
  }

  private generateRandomAbilityScore(): number {
    const rolledScores = [
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1)
    ];

    return rolledScores
      .reduce((rolls, roll) => {
        const doesNotHaveFourRolls = rolls.length < 4;

        if (doesNotHaveFourRolls && rolledScores.every((nextRoll) => roll >= nextRoll)) {
          rolls.push(roll);
        }

        return rolls;
      }, [])
      .reduce((total, roll) => total + roll, 0);
  }

  public generateMessage(name: string, race: Race, gender: Gender): string {
    const parsedRace = toProperNoun(race);

    const bondPool = require("../../resources/backgrounds.bonds.json");
    const flawPool = require("../../resources/backgrounds.flaws.json");
    const idealPool = require("../../resources/backgrounds.ideals.json");
    const titlePool = require("../../resources/backgrounds.titles.json");
    const traitPool = require("../../resources/backgrounds.traits.json");

    const bond = this.getRandomCharacteristicFrom(bondPool);
    const flaw = this.getRandomCharacteristicFrom(flawPool);
    const ideal = this.getRandomCharacteristicFrom(idealPool);
    const title = this.getRandomCharacteristicFrom(titlePool);
    const trait = this.getRandomCharacteristicFrom(traitPool);

    const wisdom = this.generateRandomAbilityScore();
    const dexterity = this.generateRandomAbilityScore();
    const strength = this.generateRandomAbilityScore();
    const intelligence = this.generateRandomAbilityScore();
    const charisma = this.generateRandomAbilityScore();
    const constitution = this.generateRandomAbilityScore();

    return `
    Meet ${name} the ${gender} ${parsedRace} ${title}

    **Ability Scores**:
    Wisdom: ${wisdom}
    Dexterity: ${dexterity}
    Strength: ${strength}
    Intelligence: ${intelligence}
    Charisma: ${charisma}
    Constitution: ${constitution}

    **Characteristics**:
    *Bond*
    ${bond}

    *Flaw*
    ${flaw}

    *Ideal*
    ${ideal}

    *Trait*
    ${trait}
    `;
  }
}
