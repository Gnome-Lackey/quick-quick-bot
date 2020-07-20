export type Ancestry =
  | "bugbear"
  | "dragonborn"
  | "dwarf"
  | "elf"
  | "ghoul"
  | "gnoll"
  | "gnome"
  | "goblin"
  | "hobgoblin"
  | "human"
  | "kobold"
  | "lizardfolk"
  | "ogre"
  | "orc"
  | "skeleton"
  | "treant"
  | "troll"
  | "zombie";

export type Experience = "green" | "regular" | "seasoned" | "veteran" | "elite" | "legend";

export type Equipment = "light" | "medium" | "heavy" | "super-heavy";

export type Type = "flying" | "archers" | "calvary" | "infantry";

export type Size = "tiny" | "small" | "medium" | "large" | "grand";

export interface UnitEquipment {
  power: number;
  defense: number;
}

export interface UnitAncestry {
  attack: number;
  power: number;
  defense: number;
  toughness: number;
  morale: number;
  traits: string[];
}

export interface UnitExperience {
  attack: number;
  toughness: number;
  morale: number;
}

export interface UnitSize {
  die: number;
  cost: number;
}

export interface UnitType {
  attack: number;
  power: number;
  defense: number;
  toughness: number;
  morale: number;
  cost: number;
}

export interface UnitStats {
  attack: string;
  power: string;
  defense: number;
  toughness: number;
  morale: string;
  cost: string;
}

export interface UnitTrait {
  name: string;
  description: string;
  cost: number;
}
