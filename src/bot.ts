import { Client, Message } from "discord.js";

import NameUtility from "./name.utility";

const qq = new Client();

const qqCommandRegex = /^qq!/;

qq.once("ready", () => {
  console.log("Howdy boss! Quick-quick Gnome Lackey at your service.");
});

qq.on("message", (message: Message) => {
  const text = message.content;

  if (!qqCommandRegex.test(text)) {
    // Ignore commands that don't begin with the quick-quick command.
    return;
  }

  message.channel.send(`I'm on it boss!`);

  const [, argumentList] = text.split("qq!");
  const args = argumentList.split(" ").filter((arg) => !!arg);
  const argumentCount = args.length;

  if (argumentCount === 0) {
    const nameUtility = new NameUtility();

    const humanFemaleFirstNames = nameUtility.buildHumanNames(1, "female");
    const humanMaleFirstNames = nameUtility.buildHumanNames(1, "male");
    const dragonbornFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "dragonborn");
    const dragonbornMaleFirstNames = nameUtility.buildNonHumanNames(1, "male", "dragonborn");
    const dwarfFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "dwarf");
    const dwarfMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "dwarf");
    const elfFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "elf");
    const elfMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "elf");
    const gnomeFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "gnome");
    const gnomeMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "gnome");
    const halflingFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "halfling");
    const halflingMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "halfling");
    const orcFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "orc");
    const orcMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "orc");
    const tieflingFemaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "tiefling");
    const tieflingMaleFirstNames = nameUtility.buildNonHumanNames(1, "female", "tiefling");

    message.channel.send(`
      *Female Names:*
      **Dragonborn:** ${dragonbornFemaleFirstNames}
      **Dwarf:** ${dwarfFemaleFirstNames}
      **Elf:** ${elfFemaleFirstNames}
      **Gnome:** ${gnomeFemaleFirstNames}
      **Halfling:** ${halflingFemaleFirstNames}
      **Human:** ${humanFemaleFirstNames}
      **Orc:** ${orcFemaleFirstNames}
      **Tiefling:** ${tieflingFemaleFirstNames}
    `);

    message.channel.send(`
      *Male Names:*
      **Dragonborn:** ${dragonbornMaleFirstNames}
      **Dwarf:** ${dwarfMaleFirstNames}
      **Elf:** ${elfMaleFirstNames}
      **Gnome:** ${gnomeMaleFirstNames}
      **Halfling:** ${halflingMaleFirstNames}
      **Human:** ${humanMaleFirstNames}
      **Orc:** ${orcMaleFirstNames}
      **Tiefling:** ${tieflingMaleFirstNames}
    `);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
