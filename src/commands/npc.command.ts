import { EmbedFieldData, MessageEmbed } from "discord.js";

import { toProperNoun } from "../utilities/qq.utility";

import { Gender, Race, BackgroundCharacteristic, BackgroundIdeal, Ideal } from "../types";

import { MESSAGE_COLOR, MESSAGE_TITLE, MESSAGE_FOOTER } from "src/constants/message.constants";
import {
  ALIGNMENT_DEFAULT,
  ALIGNMENT_ATTITUDES,
  ALIGNMENT_MORALITIES
} from "src/constants/alignment.constants";

export default class NPCUtility {
  private buildEmbedMessage(name: string, fields: EmbedFieldData[]): MessageEmbed {
    return new MessageEmbed()
      .setColor(MESSAGE_COLOR)
      .setTitle(MESSAGE_TITLE)
      .setDescription(`Hey Boss! I'd like to introduce you to *${name}!*`)
      .addFields(fields)
      .setTimestamp()
      .setFooter(MESSAGE_FOOTER);
  }

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

    if (parsedValue === ALIGNMENT_DEFAULT) {
      const attitudeRandomIndex = Math.floor(Math.random() * ALIGNMENT_ATTITUDES.length);
      const moralityRandomIndex = Math.floor(Math.random() * ALIGNMENT_MORALITIES.length);

      const attitude = ALIGNMENT_ATTITUDES[attitudeRandomIndex];
      const morality = ALIGNMENT_MORALITIES[moralityRandomIndex];

      return toProperNoun(`${attitude} ${morality}`);
    } else if (ALIGNMENT_MORALITIES.includes(parsedValue)) {
      const randomIndex = Math.floor(Math.random() * ALIGNMENT_ATTITUDES.length);

      return toProperNoun(`${ALIGNMENT_ATTITUDES[randomIndex]} ${parsedValue}`);
    } else {
      const randomIndex = Math.floor(Math.random() * ALIGNMENT_MORALITIES.length);

      return toProperNoun(`${parsedValue} ${ALIGNMENT_MORALITIES[randomIndex]}`);
    }
  }

  public generateMessage(name: string, race: Race, gender: Gender): MessageEmbed {
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

    const fields = [
      {
        name: "Characteristics",
        value: [
          `Race: ${parsedRace}`,
          `Gender: ${parsedGender}`,
          `Alignment: ${parsedAlignment}`
        ].join("\n")
      },
      {
        name: "Ability Scores",
        value: [
          `Wisdom: ${wisdom}`,
          `Dexterity: ${dexterity}`,
          `Strength: ${strength}`,
          `Intelligence: ${intelligence}`,
          `Charisma: ${charisma}`,
          `Constitution: ${constitution}`
        ].join("\n")
      },
      {
        name: `Background - ${title}`,
        value: [
          `Bond: ${bond}`,
          `Flaw: ${flaw}`,
          `Ideal: *(${idealName})* ${idealDescription}`,
          `Trait: ${trait}`
        ].join("\n")
      }
    ];

    return this.buildEmbedMessage(name, fields);
  }
}
