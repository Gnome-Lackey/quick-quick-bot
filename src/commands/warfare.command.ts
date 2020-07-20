import { EmbedFieldData, MessageEmbed } from "discord.js";

import { toProperNoun } from "../utilities/qq.utility";

import {
  WARFARE_ANCESTRY,
  WARFARE_EQUIPMENT,
  WARFARE_EXP,
  WARFARE_SIZE,
  WARFARE_TYPE
} from "../constants/warfare.constants";

import { MESSAGE_COLOR, MESSAGE_FOOTER } from "../constants/message.constants";

interface UnitEquipment {
  power: number;
  defense: number;
}

interface UnitAncestry {
  attack: number;
  power: number;
  defense: number;
  toughness: number;
  morale: number;
  traits: string[];
}

interface UnitExperience {
  attack: number;
  toughness: number;
  morale: number;
}

interface UnitSize {
  die: number;
  cost: number;
}

interface UnitType {
  attack: number;
  power: number;
  defense: number;
  toughness: number;
  morale: number;
  cost: number;
}

interface UnitStats {
  attack: string;
  power: string;
  defense: number;
  toughness: number;
  morale: string;
  cost: string;
}

interface UnitTrait {
  name: string;
  description: string;
  cost: number;
}

export default class NPCUtility {
  private buildEmbedMessage(
    name: string,
    ancestry: string,
    exp: string,
    equipment: string,
    type: string,
    cost: string,
    fields: EmbedFieldData[]
  ): MessageEmbed {
    const unitTitle = toProperNoun(`${ancestry} ${exp}`);
    const unitType = toProperNoun(`${equipment} ${type}`);

    return new MessageEmbed()
      .setColor(MESSAGE_COLOR)
      .setTitle(`${name} [${cost}]`)
      .setDescription(`${unitTitle}\n${unitType}`)
      .addFields(fields)
      .setTimestamp()
      .setFooter(MESSAGE_FOOTER);
  }

  private buildUnitStats(
    ancestry: UnitAncestry,
    equipment: UnitEquipment,
    exp: UnitExperience,
    size: UnitSize,
    type: UnitType,
    traits: UnitTrait[]
  ): UnitStats {
    const attackMod = ancestry.attack + exp.attack + type.attack;
    const powerMod = ancestry.power + equipment.power + type.power;
    const moraleMod = ancestry.morale + exp.morale + type.morale;

    const attackScore = `${attackMod >= 0 ? "+" : ""}${attackMod}`;
    const powerScore = `${powerMod >= 0 ? "+" : ""}${powerMod}`;
    const defenseScore = ancestry.defense + equipment.defense + type.defense + 10;
    const toughnessScore = ancestry.toughness + exp.toughness + type.toughness + 10;
    const moraleScore = `${moraleMod >= 0 ? "+" : ""}${moraleMod}`;
    const costOfStats = attackMod + powerMod + defenseScore + toughnessScore + moraleMod * 2;
    const costOfTraits = traits.reduce((total, trait) => trait.cost + total, 0);
    const totalCost = Math.floor(costOfStats * size.cost * type.cost * 10 + costOfTraits);

    return {
      attack: attackScore,
      power: powerScore,
      defense: defenseScore,
      toughness: toughnessScore,
      morale: moraleScore,
      cost: `${totalCost} GP`
    };
  }

  public generateMessage(name: string): MessageEmbed {
    const randomAncestry = WARFARE_ANCESTRY[Math.floor(Math.random() * WARFARE_ANCESTRY.length)];
    const ancestryPool = require("../../resources/warfare/ancestry.warfare.json");
    const ancestry = ancestryPool[randomAncestry];

    const randomEquipment = WARFARE_EQUIPMENT[Math.floor(Math.random() * WARFARE_EQUIPMENT.length)];
    const equipmentPool = require("../../resources/warfare/equipment.warfare.json");
    const equipment = equipmentPool[randomEquipment];

    const randomExperience = WARFARE_EXP[Math.floor(Math.random() * WARFARE_EXP.length)];
    const expPool = require("../../resources/warfare/experience.warfare.json");
    const experience = expPool[randomExperience];

    const randomSize = WARFARE_SIZE[Math.floor(Math.random() * WARFARE_SIZE.length)];
    const sizePool = require("../../resources/warfare/size.warfare.json");
    const size = sizePool[randomSize];

    const randomType = WARFARE_TYPE[Math.floor(Math.random() * WARFARE_TYPE.length)];
    const typePool = require("../../resources/warfare/type.warfare.json");
    const type = typePool[randomType];

    const traitPool = require("../../resources/warfare/trait.warfare.json");
    const traits = ancestry.traits.map(
      (trait: string): UnitTrait => ({ ...traitPool[trait], name: trait })
    );

    console.log(randomAncestry, randomEquipment, randomExperience, randomSize, randomType);

    const stats = this.buildUnitStats(ancestry, equipment, experience, size, type, traits);

    const fields = [
      { name: "\u200B", value: "\u200B" },
      { name: "Attack", value: stats.attack, inline: true },
      { name: "Power", value: stats.power, inline: true },
      { name: "Morale", value: stats.morale, inline: true },
      { name: "Defense", value: stats.defense, inline: true },
      { name: "Toughness", value: stats.toughness, inline: true },
      { name: "Casualty Die", value: `1d${size.die}`, inline: true },
      { name: "\u200B", value: "\u200B" },
      {
        name: "Traits",
        value: traits.map(
          (trait: UnitTrait) => `__${toProperNoun(trait.name)}:__ ${trait.description}`
        )
      }
    ];

    return this.buildEmbedMessage(
      name,
      randomAncestry,
      randomExperience,
      randomEquipment,
      randomType,
      stats.cost,
      fields
    );
  }
}
