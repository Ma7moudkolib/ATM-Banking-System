import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';
import SessionTimer from './SessionTimer';
import { LogOut, Shield, AlertTriangle, X } from 'lucide-react';

export default function Layout() {
  const { isAuthenticated, customerName, cardNumber, logout, cardBlocked } = useAuth();
  const { showWarning, dismissWarning, remainingSeconds } = useSession();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="animated-bg" />

      {/* Card blocked banner */}
      {cardBlocked && (
        <div className="bg-red-500/15 border-b border-red-500/20 px-4 py-3 text-center text-accent-red text-sm font-medium animate-slide-down">
          <AlertTriangle className="w-4 h-4 inline-block mr-2" />
          Your card has been blocked. Please contact your bank.
        </div>
      )}

      {/* Top nav bar */}
      {isAuthenticated && (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-navy-900/80 border-b border-navy-700/50">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-white leading-none">
                  {customerName}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {cardNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SessionTimer />
              <button
                onClick={handleLogout}
                id="logout-button"
                className="p-2 rounded-lg text-slate-500 hover:text-accent-red hover:bg-red-500/10 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Session warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-6 max-w-sm w-full text-center glow-indigo">
            <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-accent-amber" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Session Expiring</h3>
            <p className="text-slate-400 text-sm mb-1">
              Your session will expire in
            </p>
            <p className="text-3xl font-mono font-bold text-accent-amber mb-4">
              {remainingSeconds}s
            </p>
            <p className="text-slate-500 text-xs mb-5">
              Any interaction will reset the timer
            </p>
            <button
              onClick={dismissWarning}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
