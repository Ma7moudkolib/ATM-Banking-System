import { useState, useEffect, type ReactNode } from 'react';
import CardBlockedModal from './CardBlockedModal';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCardBlocked = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setBlockedMessage(customEvent.detail?.message || 'Your card has been blocked due to multiple failed attempts.');
    };

    window.addEventListener('card-blocked', handleCardBlocked);
    return () => window.removeEventListener('card-blocked', handleCardBlocked);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-bg-app relative">
      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>

      {/* Global Modals */}
      {blockedMessage && (
        <CardBlockedModal 
          message={blockedMessage} 
          onClose={() => setBlockedMessage(null)} 
        />
      )}
    </div>
  );
}
