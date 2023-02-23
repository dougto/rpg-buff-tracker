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
  formulas: Array<{
    name: string;
    formula: string;
  }>;
}
