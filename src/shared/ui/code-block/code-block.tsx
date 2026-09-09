'use client';

import clsx from 'clsx';
import { Check, Code2, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import { useMemo, useState } from 'react';
import styles from './code-block.module.scss';

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const normalizedLang = useMemo(() => {
    const lang = (language || 'tsx').toLowerCase();
    if (lang === 'ts' || lang === 'typescript') return 'typescript';
    if (lang === 'js' || lang === 'javascript') return 'javascript';
    if (lang === 'sh' || lang === 'shell') return 'bash';
    return lang;
  }, [language]);

  const highlighted = useMemo(() => {
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.typescript || Prism.languages.javascript;
      return Prism.highlight(code, grammar, normalizedLang);
    } catch {
      return code;
    }
  }, [code, normalizedLang]);

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <div className={clsx(styles.codeContainer, className)}>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Code2 size={14} className={styles.codeIcon} />
          <span className={styles.langBadge}>{language.toUpperCase()}</span>
        </div>

        <button
          type="button"
          className={clsx(styles.copyButton, copied && styles.copied)}
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
        >
          {copied ? (
            <>
              <Check size={12} className={styles.copyIcon} />
              <span>[Copied!]</span>
            </>
          ) : (
            <>
              <Copy size={12} className={styles.copyIcon} />
              <span>[Copy]</span>
            </>
          )}
        </button>
      </div>

      <pre className={styles.pre}>
        <code className={styles.code} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
