import type { ReactNode } from 'react';
import '@/app/styles/style.scss';

export const metadata = {
  title: 'SYNAPSE // OS',
  description: 'Autonomous Multi-Agent Cognitive Workspace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
