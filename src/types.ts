export type Genders = "male" | "female";

export type NameList = string[];

export type HumanLanguages =
  | "african"
  | "celtic"
  | "chinese"
  | "egyption"
  | "english"
  | "french"
  | "german"
  | "greek"
  | "indian"
  | "japanese"
  | "mesoamerican"
  | "norse"
  | "polynesian"
  | "roman"
  | "slavic"
  | "spanish";

export interface HumanNames {
  [language: string]: NameList;
}

export type NonHumanRaces =
  | "dragonborn"
  | "dwarf"
  | "elf"
  | "gnome"
  | "halfling"
  | "orc"
  | "tiefling";
