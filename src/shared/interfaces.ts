export interface CharactersStorage {
  [name: string]: CharacterData;
}

export interface FormulaInterface {
  name: string;
  formula: string;
}

export interface CharacterData {
  stats: Array<{
    name: string;
    value: number;
  }>;
  buffs: Array<{
    name: string;
    enabled: boolean;
    stats: Record<string, number>;
  }>;
  formulas: Array<FormulaInterface>;
}
