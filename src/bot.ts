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

    message.channel.send(`
      *Female Names:*
      **Human:** ${humanFemaleFirstNames}
    `);

    message.channel.send(`
      *Male Names:*
      **Human:** ${humanMaleFirstNames}
    `);
  }
});

qq.login(process.env.DISCORD_BOT_SECRET);
