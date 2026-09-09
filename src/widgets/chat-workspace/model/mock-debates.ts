import type { AgentDebateMessage } from '@/entities/chat';

export const MOCK_DEBATE_MESSAGES: AgentDebateMessage[] = [
  {
    slotIndex: 1,
    agentName: 'ARCHITECT',
    time: '04:12:08',
    text: '"The DOM will crash with 50,000 active nodes. Architecture strategy: enforce @tanstack/react-virtual with fixed 28px row heights. Store live streaming entries in a Circular Buffer inside a useRef to eliminate redundant re-renders of the root list."',
  },
  {
    slotIndex: 3,
    agentName: 'SECURITY SHIELD',
    time: '04:12:09',
    text: '"ReDoS Vulnerability Detected: User-supplied dynamic regex across 50k rows can trigger catastrophic backtracking and freeze the main thread. I mandate offloading regex evaluation to an isolated Web Worker with a 50ms execution timeout, plus strict XSS sanitization on raw log strings."',
  },
  {
    slotIndex: 2,
    agentName: 'DEVELOPER',
    time: '04:12:10',
    text: '"Acknowledged. Implementing Web Worker pipeline for regex parsing. Offloading scroll computation to a debounced onScroll handler: if scrollTop < scrollHeight - clientHeight - 40px, toggle isAutoScrollPaused = true until user returns to bottom."',
  },
  {
    slotIndex: 4,
    agentName: 'DEVOPS MATRIX',
    time: '04:12:11',
    text: '"Memory benchmark: 50,000 raw JS log objects consume ~45MB V8 heap. Implemented ring-buffer capping: storing recent logs in a flat indexed array to prevent GC collection pauses during 1,000 events/sec streaming bursts."',
  },
  {
    slotIndex: 5,
    agentName: 'QA VECTOR',
    time: '04:12:12',
    text: '"Test matrix compiled: injecting 4 integration suites (Vitest + RTL) to verify auto-scroll latching, boundary scroll unlocks, and a 100k synthetic event stress test maintaining stable 60 FPS without frame drops."',
  },
];
