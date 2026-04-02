import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import type { TransactionData } from '../types';

interface TransactionCardProps {
  transaction: TransactionData;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isWithdrawal =
    transaction.type?.toLowerCase() === 'withdrawal' ||
    transaction.type?.toLowerCase() === 'withdraw';
  const Icon = isWithdrawal ? ArrowUpRight : ArrowDownLeft;
  const amountColor = isWithdrawal ? 'text-danger-400' : 'text-success-400';
  const iconBgColor = isWithdrawal ? 'bg-danger-500/15' : 'bg-success-500/15';
  const iconColor = isWithdrawal ? 'text-danger-400' : 'text-success-400';
  const badgeBg = isWithdrawal ? 'bg-danger-500/15 text-danger-400' : 'bg-success-500/15 text-success-400';
  const prefix = isWithdrawal ? '−' : '+';

  const shortRef = transaction.transactionReference
    ? transaction.transactionReference.slice(-8).toUpperCase()
    : null;

  return (
    <div className="glass-card-light px-4 py-3.5 hover:bg-bg-input transition-all duration-150 group border border-border hover:border-brand-600/30 rounded-xl">
      <div className="flex items-center gap-3.5">
        {/* Icon circle */}
        <div
          className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150`}
        >
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={2.5} />
        </div>

        {/* Center: type + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${badgeBg}`}>
              {isWithdrawal ? 'Withdrawal' : 'Deposit'}
            </span>
            {shortRef && (
              <span className="text-text-muted/60 text-xs font-mono hidden sm:inline">
                #{shortRef}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5 tabular-nums">
            {formatDate(transaction.transactionDate)}
          </p>
        </div>

        {/* Right: amount + balance after */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-sm font-mono tabular-nums ${amountColor}`}>
            {prefix}${formatCurrency(transaction.amount).slice(1)}
          </p>
          <p className="text-xs text-text-muted/60 mt-0.5 font-mono tabular-nums">
            Bal ${formatCurrency(transaction.balanceAfter).slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
