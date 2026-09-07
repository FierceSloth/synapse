export interface PatternTag {
  label: string;
  iconName: string;
}

export interface PatternFooter {
  cores: string;
  mode: string;
}

export interface ThinkingPattern {
  id: string;
  patternNumber: string;
  title: string;
  description: string;
  iconName: string;
  tags: PatternTag[];
  footer: PatternFooter;
}
