import type { ThinkingPattern } from './types';

export const THINKING_PATTERNS: ThinkingPattern[] = [
  {
    id: 'fullstack-architecture',
    patternNumber: '01',
    title: 'Fullstack & Architecture',
    description: 'Zero-latency engineering, code synthesis & automated vulnerability audits',
    iconName: 'terminal',
    tags: [
      { label: 'ARCH', iconName: 'triangle' },
      { label: 'DEVElOP', iconName: 'monitor' },
      { label: 'SECURITY', iconName: 'shield' },
      { label: 'DEVOPS', iconName: 'settings' },
      { label: 'QA VECTOR', iconName: 'target' },
    ],
    footer: {
      cores: 'CORES: 5/5',
      mode: 'MODE: 3-PASS DEBATE',
    },
  },
  {
    id: 'deep-intel',
    patternNumber: '02',
    title: 'Deep Intel & Fact-Check',
    description: 'Multi-source reconnaissance, data verification & adversarial triangulation',
    iconName: 'radar',
    tags: [
      { label: 'SCOUT', iconName: 'binoculars' },
      { label: 'DATA', iconName: 'chart' },
      { label: 'SKEPTIC', iconName: 'zap' },
      { label: 'DOMAIN', iconName: 'brain' },
      { label: 'SYNTH', iconName: 'layers' },
    ],
    footer: {
      cores: 'CORES: 5/5',
      mode: 'MODE: 3-PASS DEBATE',
    },
  },
  {
    id: 'venture-gtm',
    patternNumber: '03',
    title: 'Venture & Product GTM',
    description: 'Market trajectory analysis, unit economics & aggressive growth orchestration',
    iconName: 'rocket',
    tags: [
      { label: 'PRODUCT', iconName: 'rocket' },
      { label: 'RADAR', iconName: 'trending-up' },
      { label: 'CFO', iconName: 'dollar' },
      { label: 'RISK', iconName: 'alert' },
      { label: 'GTM', iconName: 'target' },
    ],
    footer: {
      cores: 'CORES: 5/5',
      mode: 'MODE: 3-PASS DEBATE',
    },
  },
  {
    id: 'exec-decision-council',
    patternNumber: '04',
    title: 'Exec Decision Council',
    description: 'Structured deliberation, risk-weighted arbitration & final consensus binding',
    iconName: 'scale',
    tags: [
      { label: 'LOGIC', iconName: 'search' },
      { label: 'OPTIMIST', iconName: 'sun' },
      { label: 'CRITIC', iconName: 'lightning' },
      { label: 'OPERATOR', iconName: 'settings' },
      { label: 'JUDGE', iconName: 'gavel' },
    ],
    footer: {
      cores: 'CORES: 5/5',
      mode: 'MODE: 3-PASS DEBATE',
    },
  },
];
