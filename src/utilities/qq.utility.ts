export const toProperNoun = (text: string): string => {
  const firstLetter = text.charAt(0).toUpperCase();

  return `${firstLetter}${text.slice(1)}`;
};
