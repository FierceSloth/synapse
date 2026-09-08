export type PatternId = 'fullstack-architecture' | 'deep-intel' | 'venture-gtm' | 'exec-decision-council';

export type PatternIconName = 'terminal' | 'radar' | 'rocket' | 'scale';

export interface ThinkingPattern {
  id: PatternId;
  title: string;
  description: string;
  iconName: PatternIconName;
  tags: string[];
}
