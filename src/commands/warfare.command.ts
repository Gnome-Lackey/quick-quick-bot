import { EmbedFieldData, MessageEmbed } from "discord.js";

import { toProperNoun } from "../utilities/qq.utility";

import {
  UnitAncestry,
  UnitEquipment,
  UnitExperience,
  UnitSize,
  UnitType,
  UnitTrait,
  UnitStats
} from "../models/warfare.models";

import {
  WARFARE_ANCESTRY,
  WARFARE_EQUIPMENT,
  WARFARE_EXP,
  WARFARE_SIZE,
  WARFARE_TYPE,
  WARFARE_COST_MULTIPLIER,
  WARFARE_FEEBLE_TAX,
  WARFARE_SCORE_BASE,
  WARFARE_MORALE_COST_MULTIPLIER,
  WARFARE_CHARGE_MESSAGE,
  WARFARE_CHARGE_TITLE,
  WARFARE_TYPE_CAVALRY
} from "../constants/warfare.constants";

import { MESSAGE_COLOR, MESSAGE_FOOTER } from "../constants/message.constants";

export default class NPCUtility {
  private buildEmbedMessage(
    ancestry: string,
    exp: string,
    equipment: string,
    type: string,
    cost: string,
    fields: EmbedFieldData[]
  ): MessageEmbed {
    const name = toProperNoun(`${equipment} ${ancestry} ${type}`);
    const description = `__Unit Experience:__ ${toProperNoun(exp)}\n\n__Unit Cost:__ ${cost}`;

    return new MessageEmbed()
      .setColor(MESSAGE_COLOR)
      .setTitle(name)
      .setDescription(description)
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
    traits: UnitTrait[],
    isCavalry: boolean
  ): UnitStats {
    const attackMod = ancestry.attack + exp.attack + type.attack;
    const powerMod = ancestry.power + equipment.power + type.power;
    const moraleMod = ancestry.morale + exp.morale + type.morale;
    const defenseMod = ancestry.defense + equipment.defense + type.defense;
    const toughnessMod = ancestry.toughness + exp.toughness + type.toughness;

    const attackScore = `${attackMod >= 0 ? "+" : ""}${attackMod}`;
    const powerScore = `${powerMod >= 0 ? "+" : ""}${powerMod}`;
    const defenseScore = defenseMod + WARFARE_SCORE_BASE;
    const toughnessScore = toughnessMod + WARFARE_SCORE_BASE;
    const moraleScore = `${moraleMod >= 0 ? "+" : ""}${moraleMod}`;
    const costOfModifiers = attackMod + powerMod + defenseMod + toughnessMod;
    const costOfMorale = moraleMod * WARFARE_MORALE_COST_MULTIPLIER;
    const costOfAllStats = costOfModifiers + costOfMorale * size.cost * type.cost;
    const costOfTraits = traits.reduce((total, trait) => trait.cost + total, 0);

    const totalCost = Math.floor(
      (costOfAllStats + costOfTraits) * WARFARE_COST_MULTIPLIER + WARFARE_FEEBLE_TAX
    );

    if (isCavalry) {
      traits.push({
        name: WARFARE_CHARGE_TITLE,
        description: WARFARE_CHARGE_MESSAGE,
        cost: 0
      });
    }

    return {
      attack: attackScore,
      power: powerScore,
      defense: defenseScore,
      toughness: toughnessScore,
      morale: moraleScore,
      traits: traits.map(
        (trait: UnitTrait) => `__${toProperNoun(trait.name)}:__ ${trait.description}`
      ),
      cost: `${totalCost} GP`
    };
  }

  public generateMessage(
    desiredAncestry?: string,
    desiredEquipment?: string,
    desiredExp?: string,
    desiredSize?: string,
    desiredType?: string
  ): MessageEmbed {
    const randomAncestry = WARFARE_ANCESTRY[Math.floor(Math.random() * WARFARE_ANCESTRY.length)];
    const ancestryPool = require("../../resources/warfare/ancestry.warfare.json");
    const ancestry = ancestryPool[desiredAncestry || randomAncestry];

    const randomEquipment = WARFARE_EQUIPMENT[Math.floor(Math.random() * WARFARE_EQUIPMENT.length)];
    const equipmentPool = require("../../resources/warfare/equipment.warfare.json");
    const equipment = equipmentPool[desiredEquipment || randomEquipment];

    const randomExperience = WARFARE_EXP[Math.floor(Math.random() * WARFARE_EXP.length)];
    const expPool = require("../../resources/warfare/experience.warfare.json");
    const experience = expPool[desiredExp || randomExperience];

    const randomSize = WARFARE_SIZE[Math.floor(Math.random() * WARFARE_SIZE.length)];
    const sizePool = require("../../resources/warfare/size.warfare.json");
    const size = sizePool[desiredSize || randomSize];

    const randomType = WARFARE_TYPE[Math.floor(Math.random() * WARFARE_TYPE.length)];
    const typePool = require("../../resources/warfare/type.warfare.json");
    const type = typePool[desiredType || randomType];
    const isCavalry = desiredType === WARFARE_TYPE_CAVALRY || randomType === WARFARE_TYPE_CAVALRY;

    const traitPool = require("../../resources/warfare/trait.warfare.json");
    const traits = ancestry.traits.map(
      (trait: string): UnitTrait => ({ ...traitPool[trait], name: trait })
    );

    const stats = this.buildUnitStats(
      ancestry,
      equipment,
      experience,
      size,
      type,
      traits,
      isCavalry
    );

    const fields = [
      { name: "\u200B", value: "\u200B" },
      { name: "Attack", value: stats.attack, inline: true },
      { name: "Power", value: stats.power, inline: true },
      { name: "Morale", value: stats.morale, inline: true },
      { name: "Defense", value: stats.defense, inline: true },
      { name: "Toughness", value: stats.toughness, inline: true },
      { name: "Casualty Die", value: `1d${size.die}`, inline: true },
      { name: "\u200B", value: "\u200B" },
      { name: "Traits", value: stats.traits }
    ];

    return this.buildEmbedMessage(
      randomAncestry,
      randomExperience,
      randomEquipment,
      randomType,
      stats.cost,
      fields
    );
  }
}
