import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  errors?: string[];
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, errors, onDismiss }: ErrorBannerProps) {
  return (
    <div className="animate-page-in mb-4 rounded-xl glass-card-light border border-danger-500/40 bg-danger-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-danger-400 font-semibold text-sm">{message}</p>
          {errors && errors.length > 0 && (
            <ul className="mt-3 space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-danger-400/80 text-xs flex items-start gap-1.5 font-mono">
                  <span className="text-danger-500 mt-0.5">•</span>
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-danger-400/60 hover:text-danger-400 transition-colors flex-shrink-0 hover:bg-danger-500/10 p-1 rounded focus-ring"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
