import type { FinalAnswer } from '@/entities/chat';

export const MOCK_CONSENSUS_CODE = `import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

export interface LogViewerProps {
  logs: LogEntry[];
  isLive?: boolean;
  searchRegex?: string;
  onRowClick?: (log: LogEntry) => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  isLive = true,
  searchRegex,
  onRowClick,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [filterQuery, setFilterQuery] = useState(searchRegex || '');

  // Compiles sanitized regex pattern safely with fallbacks
  const compiledRegex = useMemo(() => {
    if (!filterQuery.trim()) return null;
    try {
      return new RegExp(filterQuery, 'i');
    } catch {
      return null;
    }
  }, [filterQuery]);

  // Non-blocking memoized filtering across 50,000 log records
  const filteredLogs = useMemo(() => {
    if (!compiledRegex) return logs;
    return logs.filter((log) => compiledRegex.test(log.message) || compiledRegex.test(log.source));
  }, [logs, compiledRegex]);

  // Virtualized DOM row calculation capped at 24px density
  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 10,
  });

  // Smart scroll delta listener: pauses live tail when scrolled up
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!isLive) return;
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 12;
    setIsAutoScrollPaused(!isAtBottom);
  }, [isLive]);

  // Auto-tail to the latest streaming log entry
  useEffect(() => {
    if (isLive && !isAutoScrollPaused && filteredLogs.length > 0) {
      rowVirtualizer.scrollToIndex(filteredLogs.length - 1);
    }
  }, [filteredLogs.length, isLive, isAutoScrollPaused, rowVirtualizer]);

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="h-[600px] w-full overflow-auto bg-[#030712] font-mono text-xs"
    >
      <div
        style={{
          height: \`\${rowVirtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const log = filteredLogs[virtualRow.index];
          if (!log) return null;

          const isError = log.level === 'ERROR';
          const isWarn = log.level === 'WARN';

          return (
            <div
              key={log.id || virtualRow.index}
              onClick={() => onRowClick?.(log)}
              className="absolute top-0 left-0 w-full hover:bg-[#00F0FF]/10 px-4 border-b border-[#00F0FF]/5 flex items-center gap-3 cursor-pointer select-none"
              style={{
                height: \`\${virtualRow.size}px\`,
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
            >
              <span className="text-cyan-600 text-[11px] font-mono shrink-0">
                {log.timestamp}
              </span>
              <span
                className={\`font-bold text-[10px] shrink-0 \${
                  isError ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-cyan-400'
                }\`}
              >
                [{log.level}]
              </span>
              <span className="text-cyan-500/70 font-semibold shrink-0">
                [{log.source}]
              </span>
              <span className="text-cyan-100 truncate">
                {log.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};`;

export const MOCK_CONSENSUS_MARKDOWN = `# Production-Ready Virtualized Log Viewer

The requested component has been synthesized following a multi-agent architectural review.
To meet the rigorous requirements of handling \`50,000\` live streaming rows without UI degradation, the consensus approach relies on three core optimizations:

* **Architecture:** Implemented Virtual DOM windowing via dynamic height calculation using \`@tanstack/react-virtual\`. This ensures the browser only renders a maximum of 40 visible DOM nodes at any given time, regardless of the underlying 50k row dataset.
* **Performance:** Regex search filtering operations have been abstracted away from the main thread. They execute within a debounced Web Worker environment, guaranteeing 0ms interface freezing during complex query evaluations.
* **Smart Scroll:** A specialized onScroll intersection listener continuously evaluates scroll delta. Manual user intent to scroll upward automatically triggers a soft-pause on the live-tail stream array injection to prevent viewport jumping.

\`\`\`tsx
${MOCK_CONSENSUS_CODE}
\`\`\`

### Verification & Performance Benchmarks

The Swarm Architecture Matrix executed synthetic telemetry simulations across 50,000 active rows under high-frequency stream conditions:

| Benchmark Vector | Naive Rendering | Swarm Virtualized | Delta Ratio |
| :--- | :--- | :--- | :--- |
| **DOM Node Count** | 50,000 active nodes | 24 - 40 visible nodes | **99.9% reduction** |
| **Heap Memory (V8)** | 148 MB | 16.4 MB | **-88.9% footprint** |
| **Frame Budget (FPS)** | 12 - 18 FPS (laggy) | 60 FPS (fluid) | **Zero frame drops** |
| **Regex Execution** | 320ms main thread lock | 0ms (Web Worker) | **Instant response** |

---

#### Deployment & Integration Protocol

1. **Dependency Installation:** Ensure the headless virtualization core is added to your project.
2. **Container Height Constraint:** Wrap the \`<LogViewer />\` inside a bounded parent with \`overflow-hidden\`.
3. **Live Tail Connection:** Pipe your real-time WebSocket or SSE feed directly into the \`logs\` array prop.

\`\`\`bash
npm install @tanstack/react-virtual clsx lucide-react
\`\`\`

> **CRITICAL SECURITY DIRECTIVE:** Always sanitize dynamic user input before passing it to \`RegExp\` constructors to neutralize potential Regular Expression Denial of Service (ReDoS) attack vectors.

For further architecture specifications and custom windowing algorithms, refer to the [TanStack Virtual Official Documentation](https://tanstack.com/virtual/latest).`;

export const MOCK_FINAL_ANSWER: FinalAnswer = MOCK_CONSENSUS_MARKDOWN;
