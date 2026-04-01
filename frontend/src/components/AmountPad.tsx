import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

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
      setError(`Minimum amount is ${formatCurrency(min)}`);
      return;
    }
    if (num > max) {
      setError(`Maximum amount is ${formatCurrency(max)}`);
      return;
    }
    if (multipleOf && num % multipleOf !== 0) {
      setError(`Amount must be a multiple of ${formatCurrency(multipleOf)}`);
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
    <div className="space-y-4">
      {/* Quick amount tiles */}
      <div className="grid grid-cols-3 gap-3">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleQuickSelect(amount)}
            className={`relative group p-4 rounded-xl text-center font-semibold text-lg transition-all duration-200 ${
              selectedAmount === amount
                ? 'bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300 glow-indigo'
                : 'glass-card-light hover:bg-navy-600/60 border border-transparent hover:border-indigo-500/30 text-slate-200'
            }`}
          >
            <span className="relative z-10">{formatCurrency(amount)}</span>
            {selectedAmount === amount && (
              <div className="absolute inset-0 rounded-xl bg-indigo-500/5 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="space-y-2">
        <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
          Or enter custom amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            onBlur={handleCustomBlur}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-navy-700/60 border border-navy-600/40 text-white text-lg font-mono placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        {error && (
          <p className="text-accent-red text-xs font-medium animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
}
