import { Client, Message } from "discord.js";

const qq = new Client();

const qqCommandRegex = /^qq!/;

function buildNameList(filePath: string): string {
  const listOfNames: string[] = require(filePath);
  const nameCount = listOfNames.length;

  const names: string[] = [];
  while (names.length < 3) {
    const randomIndex = Math.floor(Math.random() * nameCount);
    const name = listOfNames[randomIndex];

    if (!names.includes(name)) {
      names.push(name);
    }
  }

  const listString = JSON.stringify(names);
  const messageText = listString.replace(/["[\]]/g, "").split(",").join(", ")

  return messageText;
}

qq.once("ready", () => {
  console.log("Howdy boss! Quick-quick Gnome Lackey at your service.");
});

qq.login(process.env.DISCORD_BOT_SECRET);

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
    const maleFirstNames = buildNameList("../resources/archaic.male.names.json");
    const femaleFirstNames = buildNameList("../resources/archaic.female.names.json");

    message.channel.send(`Male human names: ${maleFirstNames}`);
    message.channel.send(`Female human names: ${femaleFirstNames}`);
  }
});
