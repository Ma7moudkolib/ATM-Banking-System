import { Clock, AlertTriangle, LogOut, RotateCw } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SessionTimer() {
  const { formattedTime, remainingSeconds, isActive, showWarning, dismissWarning, resetTimer } =
    useSession();
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!isActive) return null;

  const isWarning = remainingSeconds <= 60;
  const isUrgent = remainingSeconds <= 30;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleStayLoggedIn() {
    resetTimer();
    dismissWarning();
  }

  return (
    <>
      {/* Top bar timer pill */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all duration-300 ${
          isUrgent
            ? 'bg-danger-500/25 text-danger-400 border border-danger-500/40 animate-pulse'
            : isWarning
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-navy-700/50 text-text-secondary border border-navy-600/40'
        }`}
      >
        <Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-current' : 'text-text-muted'}`} />
        <span>{formattedTime}</span>
      </div>

      {/* Warning modal — appears when <2 min remaining */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-navy-950/85 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 max-w-sm w-full text-center glow-brand">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-text-primary mb-2">Session Expiring</h2>

            {/* Countdown */}
            <p className="text-text-secondary text-sm mb-2">Your session ends in</p>
            <p className="text-4xl font-mono font-bold text-amber-400 mb-6 font-display">
              {remainingSeconds}s
            </p>

            {/* Buttons */}
            <div className="flex gap-3 flex-col-reverse sm:flex-row">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl border border-danger-500/40 text-danger-400 hover:bg-danger-500/10 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button
                onClick={handleStayLoggedIn}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Stay logged in"
              >
                <RotateCw className="w-4 h-4" />
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

