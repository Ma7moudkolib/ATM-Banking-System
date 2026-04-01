import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      {/* Ambient background orbs — decorative only */}
      <div className="bg-orb w-96 h-96 bg-brand-500 top-[-100px] left-[-100px]" />
      <div
        className="bg-orb w-72 h-72 bg-success-500 bottom-[-80px] right-[-80px]"
        style={{ animationDelay: '4s' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-[440px] mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
