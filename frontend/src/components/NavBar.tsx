import { LogOut, Lock } from 'lucide-react';
import SessionTimer from './SessionTimer';

interface NavBarProps {
  customerName: string;
  cardNumber: string;
  pageTitle?: string;
  onLogout: () => void;
}

export default function NavBar({
  cardNumber,
  pageTitle,
  onLogout,
}: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-bg-card border-b border-border shadow-sm">
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left: Logo + Wordmark */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text-primary leading-none">
              NeoATM
            </p>
            <p className="text-xs text-text-secondary font-mono mt-0.5">
              {cardNumber}
            </p>
          </div>
        </div>

        {/* Center: Page Title (only on inner pages) */}
        {pageTitle && (
          <h1 className="text-center text-sm font-semibold text-text-primary truncate px-4">
            {pageTitle}
          </h1>
        )}

        {/* Right: Session Timer + Logout */}
        <div className="flex items-center gap-3 ml-auto">
          <SessionTimer />
          <button
            onClick={onLogout}
            id="logout-button"
            className="p-2 rounded-md text-text-secondary hover:text-danger hover:bg-danger/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
