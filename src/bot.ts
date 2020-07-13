import { Client, Message } from "discord.js";

import QQUtility from "./utility";

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
    const dragonbornFemaleFirstNames = QQUtility.buildNameListText("../resources/dragonborn.female.names.json");
    const dragonbornMaleFirstNames = QQUtility.buildNameListText("../resources/dragonborn.male.names.json");
    const dwarfFemaleFirstNames = QQUtility.buildNameListText("../resources/dwarf.female.names.json");
    const dwarfMaleFirstNames = QQUtility.buildNameListText("../resources/dwarf.male.names.json");
    const elfFemaleFirstNames = QQUtility.buildNameListText("../resources/elf.female.names.json");
    const elfMaleFirstNames = QQUtility.buildNameListText("../resources/elf.male.names.json");
    const gnomeFemaleFirstNames = QQUtility.buildNameListText("../resources/gnome.female.names.json");
    const gnomeMaleFirstNames = QQUtility.buildNameListText("../resources/gnome.male.names.json");
    const halflingFemaleFirstNames = QQUtility.buildNameListText("../resources/halfling.female.names.json");
    const halflingMaleFirstNames = QQUtility.buildNameListText("../resources/halfling.male.names.json");
    const humanFemaleFirstNames = QQUtility.buildNameListText("../resources/human.female.names.json", "all");
    const humanMaleFirstNames = QQUtility.buildNameListText("../resources/human.male.names.json", "all");
    const orcFemaleFirstNames = QQUtility.buildNameListText("../resources/orc.female.names.json");
    const orcMaleFirstNames = QQUtility.buildNameListText("../resources/orc.male.names.json");
    const smashFemaleFirstNames = QQUtility.buildNameListText("../resources/smash.female.names.json");
    const smashMaleFirstNames = QQUtility.buildNameListText("../resources/smash.male.names.json");
    const tieflingFemaleFirstNames = QQUtility.buildNameListText("../resources/tiefling.female.names.json");
    const tieflingMaleFirstNames = QQUtility.buildNameListText("../resources/tiefling.male.names.json");

    message.channel.send(`
      *Female Names:*
      **Dragonborn names:** ${dragonbornFemaleFirstNames}
      **Dwarf names:** ${dwarfFemaleFirstNames}
      **Elf names:** ${elfFemaleFirstNames}
      **Gnome names:** ${gnomeFemaleFirstNames}
      **Halfling names:** ${halflingFemaleFirstNames}
      **Human names:** ${humanFemaleFirstNames}
      **Orc names:** ${orcFemaleFirstNames}
      **Smash names:** ${smashFemaleFirstNames}
      **Tiefling names:** ${tieflingFemaleFirstNames}
    `);

    message.channel.send(`
      *Male Names:*
      **Dragonborn names:** ${dragonbornMaleFirstNames}
      **Dwarf names:** ${dwarfMaleFirstNames}
      **Elf names:** ${elfMaleFirstNames}
      **Gnome names:** ${gnomeMaleFirstNames}
      **Halfling names:** ${halflingMaleFirstNames}
      **Human names:** ${humanMaleFirstNames}
      **Orc names:** ${orcMaleFirstNames}
      **Smash names:** ${smashMaleFirstNames}
      **Tiefling names:** ${tieflingMaleFirstNames}
    `);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
