export interface BackgroundCharacteristic {
  [name: string]: string[];
  Acolyte: string[];
  Charlatan: string[];
  Criminal: string[];
  Entertainer: string[];
  "Folk Hero": string[];
  "Guild Artisan": string[];
  Hermit: string[];
  Noble: string[];
  Outlander: string[];
  Sage: string[];
  Sailor: string[];
  Soldier: string[];
  Urchin: string[];
}

export interface Ideal {
  alignment: string;
  name: string;
  description: string;
}

export interface BackgroundIdeal {
  [name: string]: Ideal[];
  Acolyte: Ideal[];
  Charlatan: Ideal[];
  Criminal: Ideal[];
  Entertainer: Ideal[];
  "Folk Hero": Ideal[];
  "Guild Artisan": Ideal[];
  Hermit: Ideal[];
  Noble: Ideal[];
  Outlander: Ideal[];
  Sage: Ideal[];
  Sailor: Ideal[];
  Soldier: Ideal[];
  Urchin: Ideal[];
}

export type Gender = "male" | "female";

export type Language =
  | "african"
  | "celtic"
  | "chinese"
  | "egyptian"
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

export type Race =
  | "dragonborn"
  | "dwarf"
  | "elf"
  | "gnome"
  | "halfling"
  | "human"
  | "orc"
  | "tiefling";
