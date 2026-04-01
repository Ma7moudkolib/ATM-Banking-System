import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import NavBar from '../components/NavBar';
import {
  ArrowUpRight,
  ArrowDownLeft,
  History,
  User,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

const actionTiles = [
  {
    id: 'withdraw',
    label: 'Withdraw',
    icon: ArrowUpRight,
    path: '/withdraw',
    sublabel: 'Cash withdrawal',
    iconColor: 'text-danger-400',
    backgroundColor: 'bg-danger-500/15',
  },
  {
    id: 'deposit',
    label: 'Deposit',
    icon: ArrowDownLeft,
    path: '/deposit',
    sublabel: 'Deposit funds',
    iconColor: 'text-success-400',
    backgroundColor: 'bg-success-500/15',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    path: '/history',
    sublabel: 'View transactions',
    iconColor: 'text-brand-400',
    backgroundColor: 'bg-brand-500/15',
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    path: '/account',
    sublabel: 'Account details',
    iconColor: 'text-amber-400',
    backgroundColor: 'bg-amber-500/15',
  },
];

export default function DashboardPage() {
  const { customerName, cardNumber, logout } = useAuth();
  const { balance, loading: balanceLoading, fetchBalance } = useBalance();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactions();
  const navigate = useNavigate();
  const [displayedBalance, setDisplayedBalance] = useState(0);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    fetchBalance();
    fetchTransactions({ fromDate: '', toDate: '', pageNumber: 1, pageSize: 3 });
  }, [fetchBalance, fetchTransactions]);

  // Count-up animation for balance
  useEffect(() => {
    if (!balanceLoading && balance?.availableBalance) {
      const targetValue = balance.availableBalance;
      const duration = 800;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayedBalance(Math.floor(targetValue * progress));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayedBalance(targetValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [balanceLoading, balance?.availableBalance]);

  return (
    <>
      {/* NavBar with page context */}
      <NavBar
        customerName={customerName}
        cardNumber={cardNumber}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 space-y-6 animate-page-in">
        {/* Hero Balance Card */}
        <div className="glass-card p-6 relative overflow-hidden glow-brand">
          {/* Decorative radial gradient overlay */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-brand-500/15 to-transparent rounded-full blur-3xl -z-1" />

          <div className="relative z-10">
            {/* Top row: Label + USD Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                Total Balance
              </span>
              <div className="inline-block px-2.5 py-1 rounded-full bg-navy-800/60 border border-navy-700/40 text-brand-400 text-xs font-mono font-medium">
                {balance?.currency || 'USD'}
              </div>
            </div>

            {/* Balance amount with count-up */}
            {balanceLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-skeleton animate-shimmer" />
                <span className="text-text-secondary">Loading...</span>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-text-primary font-display">
                    ${(displayedBalance / 100).toFixed(0)}
                  </span>
                  <span className="text-xl text-text-secondary/60 font-display">
                    .{String(displayedBalance % 100).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom row: Card info + Status */}
            <div className="flex items-center justify-between pt-4 border-t border-navy-700/40">
              <span className="text-xs text-text-muted font-mono">
                {cardNumber || '••••-••••-••••-••••'}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-success-500/15 text-success-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-success-400" />
                Active
              </div>
            </div>

            {/* Decorative watermark — credit card icon at bottom-right */}
            <CreditCard
              className="absolute bottom-2 right-2 w-24 h-24 opacity-[0.04] text-text-primary"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Quick Actions Grid (2×2) */}
        <div>
          <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {actionTiles.map((tile, index) => (
              <button
                key={tile.id}
                id={`action-${tile.id}`}
                onClick={() => navigate(tile.path)}
                className="glass-card-light p-5 text-left group transition-all duration-200 border border-navy-700/40 hover:border-brand-500/40 hover:bg-navy-800/40 focus-ring active:scale-[0.96]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon container */}
                <div
                  className={`w-11 h-11 rounded-lg ${tile.backgroundColor} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200`}
                >
                  <tile.icon className={`w-5 h-5 ${tile.iconColor}`} />
                </div>

                {/* Label */}
                <p className="text-text-primary font-semibold text-sm mb-0.5">{tile.label}</p>

                {/* Sublabel */}
                <p className="text-text-secondary text-xs">{tile.sublabel}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
              Recent Activity
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
            >
              See all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {transactionsLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-skeleton rounded-lg animate-shimmer"
                />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 3).map((transaction, index) => (
                <div
                  key={transaction.transactionDate}
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TransactionCard transaction={transaction} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p className="text-xs">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
