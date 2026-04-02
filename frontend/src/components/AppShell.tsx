import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-bg-app">
      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}
