import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyber' | 'primary';
  icon?: ReactNode;
  withCorners?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'cyber',
  icon,
  withCorners = true,
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)} {...props}>
      {withCorners && (
        <>
          <span className={styles.cornerTl} />
          <span className={styles.cornerBr} />
        </>
      )}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.content}>{children}</span>}
    </button>
  );
}
