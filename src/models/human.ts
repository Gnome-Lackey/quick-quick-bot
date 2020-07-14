import { NameList } from "./name";

export type HumanGenders = "male" | "female";
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
