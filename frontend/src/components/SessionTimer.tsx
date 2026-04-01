import { Clock } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function SessionTimer() {
  const { formattedTime, remainingSeconds, isActive } = useSession();

  if (!isActive) return null;

  const isWarning = remainingSeconds <= 60;
  const isUrgent = remainingSeconds <= 30;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all duration-300 ${
        isUrgent
          ? 'bg-red-500/20 text-accent-red border border-red-500/30 animate-pulse'
          : isWarning
          ? 'bg-amber-500/15 text-accent-amber border border-amber-500/20'
          : 'bg-navy-700/50 text-slate-300 border border-navy-600/30'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-current' : 'text-slate-500'}`} />
      <span>{formattedTime}</span>
    </div>
  );
}
