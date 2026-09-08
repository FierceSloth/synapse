import type { PatternId } from '@/entities/pattern';

export interface AgentDebateMessage {
  slotIndex: number;
  agentName: string;
  text: string;
  time: string;
}

export interface FinalAnswerPoint {
  label: string;
  description: string;
}

export interface FinalAnswer {
  title: string;
  overview: string;
  points: FinalAnswerPoint[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export type IterationStatus = 'calibration' | 'debating' | 'completed';

export interface ChatIteration {
  id: string;
  userQuery: string;
  timestamp: string;
  status: IterationStatus;
  debates?: AgentDebateMessage[];
  debateProgress?: number;
  answer?: FinalAnswer;
}

export interface Chat {
  id: string;
  title: string;
  time: string;
  patternId: PatternId;
  iterations: ChatIteration[];
}
