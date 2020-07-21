import { EmbedFieldData, MessageEmbed } from "discord.js";

import { toProperNoun } from "../utilities/qq.utility";

import {
  UnitAncestry,
  UnitEquipment,
  UnitExperience,
  UnitSize,
  UnitType,
  UnitTrait,
  UnitStats,
  WarfareEquipmentType,
  WarfareExperienceType,
  WarfareUnitType,
  WarfareSizeType,
  WarfareAncestryType
} from "../models/warfare.models";

import {
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

    const totalCost = Math.floor(costOfAllStats * WARFARE_COST_MULTIPLIER + costOfTraits + WARFARE_FEEBLE_TAX);

    if (isCavalry) {
      traits.push({
        name: WARFARE_CHARGE_TITLE,
        description: WARFARE_CHARGE_MESSAGE,
        cost: 0
      });
    }

    const unitTraits = traits.map((trait: UnitTrait) => `__${toProperNoun(trait.name)}:__ ${trait.description}`);

    return {
      attack: attackScore,
      power: powerScore,
      defense: defenseScore,
      toughness: toughnessScore,
      morale: moraleScore,
      traits: unitTraits,
      cost: `${totalCost} GP`
    };
  }

  public generateMessage(
    ancestryName?: WarfareAncestryType,
    equipmentName?: WarfareEquipmentType,
    experienceName?: WarfareExperienceType,
    sizeName?: WarfareSizeType,
    typeName?: WarfareUnitType
  ): MessageEmbed {
    const ancestryPool = require("../../resources/warfare/ancestry.warfare.json");
    const ancestry = ancestryPool[ancestryName];

    const equipmentPool = require("../../resources/warfare/equipment.warfare.json");
    const equipment = equipmentPool[equipmentName];

    const expPool = require("../../resources/warfare/experience.warfare.json");
    const experience = expPool[experienceName];

    const sizePool = require("../../resources/warfare/size.warfare.json");
    const size = sizePool[sizeName];

    const typePool = require("../../resources/warfare/type.warfare.json");
    const type = typePool[typeName];
    const isCavalry = (typeName as string) === WARFARE_TYPE_CAVALRY;

    const traitPool = require("../../resources/warfare/trait.warfare.json");
    const traits = ancestry.traits.map((trait: string): UnitTrait => ({ ...traitPool[trait], name: trait }));

    console.log(ancestryName, equipmentName, experienceName, sizeName, typeName);
    console.log(ancestry, equipment, experience, size, type);

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
      ancestryName,
      experienceName,
      equipmentName,
      typeName,
      stats.cost,
      fields
    );
  }
}
