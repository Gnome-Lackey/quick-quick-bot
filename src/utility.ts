export default class QQUtility {
  static buildNameListText(filePath: string, subcategory: string = null): string {
    let listOfNames: string[] = [];

    if (subcategory === "all") {
      const json: { [category: string]: string[] } = require(filePath);
      const categories = Object.keys(json);

      listOfNames = categories.reduce((list, category) => list.concat(json[category]), []);
    } else if (subcategory) {
      const json: { [category: string]: string[] } = require(filePath);

      listOfNames = json[subcategory];
    } else {
      const json: string[] = require(filePath);

      listOfNames = json;
    }

    const nameCount = listOfNames.length;

    const names: string[] = [];
    while (names.length < 3) {
      const randomIndex = Math.floor(Math.random() * nameCount);
      const name = listOfNames[randomIndex];

      if (!names.includes(name)) {
        names.push(name);
      }
    }

    const arrayStyleTextRegex = /["[\]]/g;
    const arrayStyleDelimiterRegex = /[,]/g;

    return JSON.stringify(names)
      .replace(arrayStyleTextRegex, "")
      .replace(arrayStyleDelimiterRegex, ", ");
  }
}
