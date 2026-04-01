import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  errors?: string[];
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, errors, onDismiss }: ErrorBannerProps) {
  return (
    <div className="animate-slide-down mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-accent-red font-medium text-sm">{message}</p>
          {errors && errors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-red-300/80 text-xs flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">•</span>
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
