import { useState } from 'react';
import { Check } from 'lucide-react';

interface AmountPadProps {
  onAmountSelected: (amount: number) => void;
  quickAmounts: number[];
  max: number;
  min?: number;
  multipleOf?: number;
  selectedAmount?: number;
}

export default function AmountPad({
  onAmountSelected,
  quickAmounts,
  max,
  min = 1,
  multipleOf,
  selectedAmount,
}: AmountPadProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleQuickSelect(amount: number) {
    setCustomAmount('');
    setError(null);
    onAmountSelected(amount);
  }

  function handleCustomChange(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, '');
    setCustomAmount(cleaned);
    setError(null);

    const num = parseFloat(cleaned);
    if (isNaN(num) || cleaned === '') return;

    if (num < min) {
      setError(`Minimum amount is $${min}`);
      return;
    }
    if (num > max) {
      setError(`Maximum amount is $${max.toFixed(2)}`);
      return;
    }
    if (multipleOf && num % multipleOf !== 0) {
      setError(`Amount must be a multiple of $${multipleOf}`);
      return;
    }

    onAmountSelected(num);
  }

  function handleCustomBlur() {
    const num = parseFloat(customAmount);
    if (!isNaN(num) && num >= min && num <= max) {
      if (multipleOf && num % multipleOf !== 0) return;
      onAmountSelected(num);
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick amount tiles */}
      <div>
        <h3 className="text-xs text-text-secondary/70 uppercase tracking-widest font-semibold mb-3">
          Quick Amounts
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickSelect(amount)}
              className={`relative group p-4 rounded-xl text-center font-semibold text-sm transition-all duration-200 border ${
                selectedAmount === amount
                  ? 'bg-brand-500/20 border-brand-500/60 text-brand-400'
                  : 'bg-navy-800/40 border-navy-700/60 text-text-primary hover:border-brand-500/40 hover:bg-navy-800/60'
              }`}
            >
              {/* Amount text */}
              <span className="relative z-10 font-mono">${(amount / 100).toFixed(2)}</span>

              {/* Checkmark on selected */}
              {selectedAmount === amount && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand-400" />
                </div>
              )}

              {/* Ripple effect on selected */}
              {selectedAmount === amount && (
                <div className="absolute inset-0 rounded-xl bg-brand-500/5 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-navy-700/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-navy-900 px-3 text-xs text-text-muted/70">
            OR CUSTOM AMOUNT
          </span>
        </div>
      </div>

      {/* Custom amount input */}
      <div className="space-y-3">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-xl">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            onBlur={handleCustomBlur}
            placeholder="0.00"
            className={`w-full pl-9 pr-4 py-4 rounded-xl text-2xl font-mono font-bold text-center transition-all duration-200 border ${
              error
                ? 'bg-danger-500/10 border-danger-500/40 text-danger-400'
                : customAmount && !error
                ? 'bg-success-500/10 border-success-500/40 text-success-400'
                : 'bg-navy-800/50 border-navy-700/60 text-text-primary placeholder:text-text-muted/50'
            } focus:ring-2 ${
              error
                ? 'focus:ring-danger-500/20'
                : customAmount
                ? 'focus:ring-success-500/20'
                : 'focus:ring-brand-500/20'
            }`}
          />
        </div>

        {/* Error or hint text */}
        {error && (
          <p className="text-danger-400 text-xs font-medium animate-shake text-center">
            {error}
          </p>
        )}
        {!error && customAmount && parseFloat(customAmount) > 0 && (
          <p className="text-success-400 text-xs font-medium text-center">
            ✓ Valid amount
          </p>
        )}
      </div>
    </div>
  );
}
