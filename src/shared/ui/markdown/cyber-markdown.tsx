'use client';

import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../code-block';
import styles from './cyber-markdown.module.scss';

export interface CyberMarkdownProps {
  content: string;
  className?: string;
}

function extractText(child: unknown): string {
  if (typeof child === 'string' || typeof child === 'number') {
    return String(child);
  }
  if (Array.isArray(child)) {
    return child.map(extractText).join('');
  }
  return '';
}

export function CyberMarkdown({ content, className }: CyberMarkdownProps) {
  return (
    <div className={clsx(styles.markdownRoot, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClass, children, ...rest }) {
            const match = /language-(\w+)/.exec(codeClass || '');
            const rawCode = extractText(children).replace(/\n$/, '');
            const isInline = !match && !rawCode.includes('\n');

            if (isInline) {
              return (
                <code className={styles.inlineCode} {...rest}>
                  {children}
                </code>
              );
            }

            const lang = match ? match[1] : 'tsx';

            return <CodeBlock code={rawCode} language={lang} />;
          },
          ul({ children }) {
            return <ul className={styles.list}>{children}</ul>;
          },
          li({ children }) {
            return (
              <li className={styles.listItem}>
                <span className={styles.bulletDot} aria-hidden="true" />
                <div className={styles.listItemContent}>{children}</div>
              </li>
            );
          },
          p({ children }) {
            return <p className={styles.paragraph}>{children}</p>;
          },
          h1({ children }) {
            return <h1 className={styles.h1}>{children}</h1>;
          },
          h2({ children }) {
            return <h2 className={styles.h2}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 className={styles.h3}>{children}</h3>;
          },
          h4({ children }) {
            return <h4 className={styles.h4}>{children}</h4>;
          },
          blockquote({ children }) {
            return <blockquote className={styles.blockquote}>{children}</blockquote>;
          },
          ol({ children }) {
            return <ol className={styles.orderedList}>{children}</ol>;
          },
          a({ href, children }) {
            return (
              <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          hr() {
            return <hr className={styles.hr} />;
          },
          table({ children }) {
            return (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
