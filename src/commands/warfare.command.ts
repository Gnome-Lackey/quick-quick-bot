import { EmbedFieldData, MessageEmbed } from "discord.js";

import {
  WARFARE_ANCESTRY,
  WARFARE_EQUIPMENT,
  WARFARE_EXP,
  WARFARE_SIZE,
  WARFARE_TYPE
} from "../constants/warfare.constants";

import { MESSAGE_COLOR, MESSAGE_TITLE, MESSAGE_FOOTER } from "../constants/message.constants";

export default class NPCUtility {
  private buildEmbedMessage(name: string, fields: EmbedFieldData[]): MessageEmbed {
    return new MessageEmbed()
      .setColor(MESSAGE_COLOR)
      .setTitle(MESSAGE_TITLE)
      .setDescription(`Hey Boss! Your new unit awaits your command! Say hello to the *${name}*`)
      .addFields(fields)
      .setTimestamp()
      .setFooter(MESSAGE_FOOTER);
  }

  public generateMessage(name: string): MessageEmbed {
    const fields = [];

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

    return this.buildEmbedMessage(name, fields);
  }
}
