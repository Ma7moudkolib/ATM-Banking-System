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
  const amountColor = isWithdrawal ? 'text-accent-red' : 'text-accent-green';
  const iconBg = isWithdrawal ? 'bg-red-500/10' : 'bg-emerald-500/10';
  const iconColor = isWithdrawal ? 'text-accent-red' : 'text-accent-green';
  const prefix = isWithdrawal ? '-' : '+';

  return (
    <div className="glass-card-light p-4 hover:bg-navy-600/40 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Center: type + reference */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isWithdrawal
                  ? 'bg-red-500/15 text-accent-red-light'
                  : 'bg-emerald-500/15 text-accent-green-light'
              }`}
            >
              {isWithdrawal ? 'Withdrawal' : 'Deposit'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500 font-mono truncate">
              {transaction.transactionReference
                ? `REF: ${transaction.transactionReference.slice(0, 12)}...`
                : ''}
            </p>
            <span className="text-slate-700">•</span>
            <p className="text-xs text-slate-500">
              {formatDate(transaction.transactionDate)}
            </p>
          </div>
        </div>

        {/* Right: amount + balance */}
        <div className="text-right flex-shrink-0">
          <p className={`font-semibold ${amountColor}`}>
            {prefix}{formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Balance: {formatCurrency(transaction.balanceAfter)}
          </p>
        </div>
      </div>
    </div>
  );
}
