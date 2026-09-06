import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './icon-button.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'cyber' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ icon, className, variant = 'cyber', size = 'md', ...props }: IconButtonProps) {
  return (
    <button className={clsx(styles.iconButton, styles[variant], styles[size], className)} {...props}>
      {icon}
    </button>
  );
}
