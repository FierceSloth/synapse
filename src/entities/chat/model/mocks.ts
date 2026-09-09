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
        answer: {
          title: 'Production-Ready Virtualized Log Viewer',
          overview:
            'The requested component has been synthesized following a multi-agent architectural review. To meet the rigorous requirements of handling 50,000 live streaming rows without UI degradation, the consensus approach relies on three core optimizations:',
          points: [
            {
              label: 'Architecture',
              description:
                'Implemented Virtual DOM windowing via dynamic height calculation. This ensures the browser only renders a maximum of 40 visible DOM nodes at any given time, regardless of the underlying 50k row dataset.',
            },
            {
              label: 'Performance',
              description:
                'Regex search filtering operations have been abstracted away from the main thread. They execute within a debounced Web Worker environment, guaranteeing 0ms interface freezing during complex query evaluations.',
            },
            {
              label: 'Smart Scroll',
              description:
                'A specialized onScroll intersection listener continuously evaluates scroll delta. Manual user intent to scroll upward automatically triggers a soft-pause on the live-tail stream array injection to prevent viewport jumping.',
            },
          ],
          codeSnippet: {
            language: 'TSX',
            code: `import { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface LogViewerProps {
  logs: Array<{ id: string; timestamp: number; message: string; level: string }>;
  isLive?: boolean;
  searchRegex?: string;
}

export const VirtualizedLogViewer = ({ logs, isLive = true, searchRegex }: LogViewerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(isLive);

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="log-container">
      <div style={{ height: \`\${rowVirtualizer.getTotalSize()}px\` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div key={virtualRow.index} className="log-row">
            {logs[virtualRow.index]?.message}
          </div>
        ))}
      </div>
    </div>
  );
};`,
          },
        },
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
