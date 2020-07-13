export default class QQUtility {
  static buildNameListText(filePath: string): string {
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

    const nonMessageTextRegex = /["[\]]/g;

    return JSON.stringify(names)
      .replace(nonMessageTextRegex, "")
      .split(",")
      .join(", ");
  }
}
