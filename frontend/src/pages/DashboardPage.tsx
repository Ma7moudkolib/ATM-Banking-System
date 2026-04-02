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
  TrendingUp,
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
    hoverBorder: 'hover:border-danger-500/30',
  },
  {
    id: 'deposit',
    label: 'Deposit',
    icon: ArrowDownLeft,
    path: '/deposit',
    sublabel: 'Deposit funds',
    iconColor: 'text-success-400',
    backgroundColor: 'bg-success-500/15',
    hoverBorder: 'hover:border-success-500/30',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    path: '/history',
    sublabel: 'View transactions',
    iconColor: 'text-brand-400',
    backgroundColor: 'bg-brand-500/15',
    hoverBorder: 'hover:border-brand-500/30',
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    path: '/account',
    sublabel: 'Account details',
    iconColor: 'text-amber-400',
    backgroundColor: 'bg-amber-500/15',
    hoverBorder: 'hover:border-amber-500/30',
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
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setDisplayedBalance(Math.floor(targetValue * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayedBalance(targetValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [balanceLoading, balance?.availableBalance]);

  // Format balance: value is in cents, convert to dollars
  const balanceDollars = Math.floor(displayedBalance / 100);
  const balanceCents = String(displayedBalance % 100).padStart(2, '0');

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
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-radial from-brand-500/10 to-transparent rounded-full blur-3xl -z-1 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-radial from-brand-600/8 to-transparent rounded-full blur-2xl -z-1 pointer-events-none" />

          <div className="relative z-10">
            {/* Top row: Label + USD Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-400/70" />
                <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                  Available Balance
                </span>
              </div>
              <div className="inline-block px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700/50 text-brand-400 text-xs font-mono font-medium">
                {balance?.currency || 'USD'}
              </div>
            </div>

            {/* Balance amount with count-up */}
            {balanceLoading ? (
              <div className="mb-4 space-y-2">
                <div className="skeleton h-12 w-48 rounded-lg animate-shimmer" />
                <div className="skeleton h-3 w-24 rounded animate-shimmer" />
              </div>
            ) : (
              <div className="mb-5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg text-text-secondary/60 font-mono self-start mt-2 mr-0.5">$</span>
                  <span className="text-5xl font-bold text-text-primary font-mono tabular-nums tracking-tight">
                    {balanceDollars.toLocaleString()}
                  </span>
                  <span className="text-2xl text-text-secondary/50 font-mono tabular-nums self-end mb-0.5">
                    .{balanceCents}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom row: Card info + Status */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-xs text-text-muted font-mono tracking-wider">
                {cardNumber || '••••-••••-••••-••••'}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/15 text-success-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                Active
              </div>
            </div>

            {/* Decorative watermark */}
            <CreditCard
              className="absolute bottom-4 right-4 w-20 h-20 opacity-[0.035] text-text-primary"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Quick Actions Grid (2×2) */}
        <div>
          <h2 className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-3 px-0.5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {actionTiles.map((tile, index) => (
              <button
                key={tile.id}
                id={`action-${tile.id}`}
                onClick={() => navigate(tile.path)}
                className={`glass-card-light p-5 text-left group transition-all duration-200 border border-navy-700/40 ${tile.hoverBorder} hover:bg-navy-800/50 focus-ring active:scale-[0.96]`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon container */}
                <div
                  className={`w-11 h-11 rounded-xl ${tile.backgroundColor} flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-200`}
                >
                  <tile.icon className={`w-5 h-5 ${tile.iconColor}`} strokeWidth={2} />
                </div>

                {/* Label */}
                <p className="text-text-primary font-semibold text-sm mb-0.5">{tile.label}</p>

                {/* Sublabel */}
                <p className="text-text-muted text-xs leading-snug">{tile.sublabel}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="text-xs text-text-muted uppercase tracking-widest font-semibold">
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
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="skeleton h-[62px] rounded-xl animate-shimmer"
                  style={{ opacity: 1 - i * 0.15 }}
                />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 3).map((transaction, index) => (
                <div
                  key={transaction.transactionDate}
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <TransactionCard transaction={transaction} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card-light border border-navy-700/40 rounded-xl py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-navy-700/40 flex items-center justify-center mx-auto mb-3">
                <History className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-text-secondary text-sm font-medium mb-0.5">No transactions yet</p>
              <p className="text-text-muted text-xs">Your activity will appear here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
