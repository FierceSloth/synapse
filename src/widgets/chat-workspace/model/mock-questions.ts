import type { ClarificationQuestion } from '@/entities/chat';

export const MOCK_QUESTIONS: ClarificationQuestion[] = [
  {
    id: 'q1',
    title: 'VECTOR 01 [VIRTUALIZATION ENGINE]',
    options: [
      'TanStack Virtual (Headless)',
      'React Virtuoso (Dynamic row heights)',
      'Pure CSS content-visibility + DOM recycling',
    ],
    defaultOption: 'TanStack Virtual (Headless)',
  },
  {
    id: 'q2',
    title: 'VECTOR 02 [SEARCH & FILTERING PIPELINE]',
    options: ['Dedicated Web Worker (Non-blocking)', 'Client-side RegExp with RAF Throttling', 'WASM-based Rust Grep'],
    defaultOption: 'Dedicated Web Worker (Non-blocking)',
  },
  {
    id: 'q3',
    title: 'VECTOR 03 [SCROLL & ANCHOR BEHAVIOR]',
    options: [
      'IntersectionObserver on container edge',
      'Passive wheel listener + manual delta threshold',
      'Stick-to-bottom scroll hook',
    ],
    defaultOption: 'IntersectionObserver on container edge',
  },
  {
    id: 'q4',
    title: 'VECTOR 04 [STATE & BUFFER HANDLING]',
    options: [
      'Circular Ring-Buffer with useRef',
      'Zustand slice with batching updates',
      'Signals (Zero-render updates)',
    ],
    defaultOption: 'Circular Ring-Buffer with useRef',
  },
  {
    id: 'q5',
    title: 'VECTOR 05 [TESTING STRATEGY]',
    options: [
      'Vitest + React Testing Library',
      'Playwright Component Testing (Real scroll events)',
      'Vitest + Benchmarking suite',
    ],
    defaultOption: 'Vitest + React Testing Library',
  },
  {
    id: 'q6',
    title: 'VECTOR 06 [RUNTIME PERFORMANCE STRICTNESS]',
    options: [
      'Relaxed (Standard rendering)',
      'Balanced (60fps target, <25kB budget)',
      'Strict (Zero frame-drops, 16ms budget)',
      'Maximum (Zero frame-drops, <7kB budget)',
    ],
    defaultOption: 'Maximum (Zero frame-drops, <7kB budget)',
  },
];

export function getDefaultAnswers(questions: ClarificationQuestion[] = MOCK_QUESTIONS): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const q of questions) {
    answers[q.id] = q.defaultOption ?? q.options[0] ?? '';
  }
  return answers;
}
