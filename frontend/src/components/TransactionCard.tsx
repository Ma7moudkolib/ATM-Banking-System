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
  const prefix = isWithdrawal ? '−' : '+';

  return (
    <div className="glass-card-light p-4 hover:bg-navy-800/40 transition-all duration-150 group border border-navy-700/40 hover:border-navy-600/60">
      <div className="flex items-center gap-4">
        {/* Icon circle */}
        <div
          className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-5 h-5 ${amountColor}`} />
        </div>

        {/* Center: type + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                isWithdrawal
                  ? 'bg-danger-500/20 text-danger-400'
                  : 'bg-success-500/20 text-success-400'
              }`}
            >
              {isWithdrawal ? 'Withdrawal' : 'Deposit'}
            </span>
          </div>
          <p className="text-xs text-text-muted font-mono truncate">
            {transaction.transactionReference
              ? `REF: ${transaction.transactionReference.slice(0, 12)}...`
              : ''}
          </p>
          <p className="text-xs text-text-muted/70 mt-0.5">
            {formatDate(transaction.transactionDate)}
          </p>
        </div>

        {/* Right: amount + balance after */}
        <div className="text-right flex-shrink-0">
          <p className={`font-semibold text-sm ${amountColor}`}>
            {prefix}${formatCurrency(transaction.amount).slice(1)}
          </p>
          <p className="text-xs text-text-muted/70 mt-0.5">
            Bal ${formatCurrency(transaction.balanceAfter).slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
