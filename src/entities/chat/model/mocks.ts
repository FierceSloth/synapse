import { MOCK_FINAL_ANSWER } from './mock-consensus';
import type { Chat } from './types';

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-virtualized-log-viewer',
    title: 'Virtualized Log Viewer',
    time: '09:42',
    patternId: 'fullstack-architecture',
    iterations: [
      {
        id: 'iter-1',
        userQuery:
          'I need a virtualized log-viewer component for our monitoring dashboard. It has to handle up to 50,000 live streaming rows without freezing the tab, support regex search filtering, and include an auto-scroll toggle that pauses whenever the user manually scrolls up. Generate the complete component with tests.',
        timestamp: '04:12:08',
        status: 'calibration',
        answer: MOCK_FINAL_ANSWER,
      },
    ],
  },
  {
    id: 'chat-security-audit-protocol',
    title: 'Security Audit Protocol',
    time: '07:15',
    patternId: 'fullstack-architecture',
    iterations: [],
  },
  {
    id: 'chat-schema-migration',
    title: 'Schema Migration',
    time: '22:30',
    patternId: 'deep-intel',
    iterations: [],
  },
];
