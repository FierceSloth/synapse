import type { PatternId } from '@/entities/pattern';

export interface AgentDebateMessage {
  slotIndex: number;
  agentName: string;
  text: string;
  time: string;
}

export type FinalAnswer = string;

export type IterationStatus = 'calibration' | 'debating' | 'completed';

export interface ClarificationQuestion {
  id: string;
  title: string;
  options: string[];
  defaultOption?: string;
}

export type ClarificationAnswers = Record<string, string>;

export interface ChatIteration {
  id: string;
  userQuery: string;
  timestamp: string;
  status: IterationStatus;
  questions?: ClarificationQuestion[];
  answers?: ClarificationAnswers;
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
