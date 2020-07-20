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
  WARFARE_MORALE_COST_MULTIPLIER
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
    traits: UnitTrait[]
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
    const costOfStats = attackMod + powerMod + defenseMod + toughnessMod + moraleMod * WARFARE_MORALE_COST_MULTIPLIER;
    const costOfTraits = traits.reduce((total, trait) => trait.cost + total, 0);

    const totalCost = Math.floor(
      costOfStats * size.cost * type.cost * WARFARE_COST_MULTIPLIER +
        costOfTraits +
        WARFARE_FEEBLE_TAX
    );

    return {
      attack: attackScore,
      power: powerScore,
      defense: defenseScore,
      toughness: toughnessScore,
      morale: moraleScore,
      cost: `${totalCost} GP`
    };
  }

  public generateMessage(): MessageEmbed {
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

    const stats = this.buildUnitStats(ancestry, equipment, experience, size, type, traits);

    if (randomType === "cavalry") {
      traits.push({
        name: "charge",
        description: "Cannot use while engaged. A Charge is an attack with advantage on the Attack check. It inflicts 2 casualties on a successful Power check. The charging unit is then engaged with the defending unit and must make a DC 13 Morale check to disengage.",
      });
    }

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
      randomAncestry,
      randomExperience,
      randomEquipment,
      randomType,
      stats.cost,
      fields
    );
  }
}