import type { PatternId } from '@/entities/pattern';
import type { SwarmAgent } from './types';

export const PATTERN_AGENTS: Record<PatternId, SwarmAgent[]> = {
  'fullstack-architecture': [
    { name: 'ARCHITECT', iconName: 'boxes' },
    { name: 'DEVELOPER', iconName: 'code' },
    { name: 'SECURITY SHIELD', iconName: 'shield' },
    { name: 'DEVOPS MATRIX', iconName: 'server' },
    { name: 'QA VECTOR', iconName: 'crosshair' },
  ],
  'deep-intel': [
    { name: 'SCOUT RECON', iconName: 'radar' },
    { name: 'DATA ANALYST', iconName: 'binary' },
    { name: 'SKEPTIC AUDIT', iconName: 'alert-triangle' },
    { name: 'DOMAIN EXPERT', iconName: 'brain' },
    { name: 'SYNTHESIS CORE', iconName: 'layers' },
  ],
  'venture-gtm': [
    { name: 'PRODUCT LEAD', iconName: 'rocket' },
    { name: 'MARKET RADAR', iconName: 'trending-up' },
    { name: 'RISK SENTINEL', iconName: 'shield-alert' },
    { name: 'CFO MATRIX', iconName: 'dollar' },
    { name: 'GTM VECTOR', iconName: 'target' },
  ],
  'exec-decision-council': [
    { name: 'LOGIC ARBITER', iconName: 'compass' },
    { name: 'OPTIMIST VISION', iconName: 'sun' },
    { name: 'CHIEF CRITIC', iconName: 'zap' },
    { name: 'OPERATOR', iconName: 'sliders' },
    { name: 'COUNCIL JUDGE', iconName: 'gavel' },
  ],
};
