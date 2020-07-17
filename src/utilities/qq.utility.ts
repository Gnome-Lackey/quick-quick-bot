export const toProperNoun = (text: string): string => {
  const words = text.split(" ");

  return words
    .reduce((properNouns, word) => {
      const firstLetter = word.charAt(0).toUpperCase();

      return [...properNouns, `${firstLetter}${word.slice(1)}`];
    }, [])
    .join(" ");
};
