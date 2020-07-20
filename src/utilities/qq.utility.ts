const WORDS_TO_SKIP = [
  "a",
  "an",
  "the",
  "at",
  "by",
  "for",
  "in",
  "of",
  "on",
  "to",
  "up",
  "and",
  "as",
  "but",
  "or",
  "nor"
];

export const toProperNoun = (text: string): string => {
  const words = text.split(" ");

  return words
    .reduce((properNouns, word) => {
      if (WORDS_TO_SKIP.includes(word)) return [...properNouns, word];

      const firstLetter = word.charAt(0).toUpperCase();

      return [...properNouns, `${firstLetter}${word.slice(1)}`];
    }, [])
    .join(" ");
};
