import '@/app/styles/style.scss';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'SYNAPSE // OS',
  description: 'Autonomous Multi-Agent Cognitive Workspace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg">
          <div className="bgGlowBlue" />
          <div className="bgGlowCyan" />
        </div>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
