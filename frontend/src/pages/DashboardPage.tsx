import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ArrowUpRight,
  ArrowDownLeft,
  History,
  User,
  Wallet,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const actionTiles = [
  {
    id: 'withdraw',
    label: 'Withdraw',
    icon: ArrowUpRight,
    path: '/withdraw',
    color: 'from-red-500/15 to-red-600/10',
    iconColor: 'text-accent-red',
    borderColor: 'hover:border-red-500/30',
  },
  {
    id: 'deposit',
    label: 'Deposit',
    icon: ArrowDownLeft,
    path: '/deposit',
    color: 'from-emerald-500/15 to-emerald-600/10',
    iconColor: 'text-accent-green',
    borderColor: 'hover:border-emerald-500/30',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    path: '/history',
    color: 'from-blue-500/15 to-blue-600/10',
    iconColor: 'text-accent-blue',
    borderColor: 'hover:border-blue-500/30',
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    path: '/account',
    color: 'from-indigo-500/15 to-indigo-600/10',
    iconColor: 'text-navy-400',
    borderColor: 'hover:border-indigo-500/30',
  },
];

export default function DashboardPage() {
  const { customerName, cardNumber } = useAuth();
  const { balance, loading, fetchBalance } = useBalance();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-bold text-white">
          Welcome, <span className="text-indigo-400">{customerName}</span>
        </h1>
        <p className="text-slate-500 text-sm font-mono mt-1">{cardNumber}</p>
      </div>

      {/* Balance card */}
      <div className="glass-card p-6 glow-indigo relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Available Balance
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="text-slate-400 text-sm">Loading...</span>
            </div>
          ) : balance ? (
            <>
              <p className="text-4xl font-bold text-white tracking-tight">
                {formatCurrency(balance.availableBalance, balance.currency)}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp className="w-3.5 h-3.5 text-accent-green" />
                <span className="text-xs text-slate-500">
                  {balance.currency} Account • {balance.accountNumber}
                </span>
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Unable to load balance</p>
          )}
        </div>
      </div>

      {/* Action tiles */}
      <div>
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {actionTiles.map((tile) => (
            <button
              key={tile.id}
              id={`action-${tile.id}`}
              onClick={() => navigate(tile.path)}
              className={`glass-card-light p-5 text-left group transition-all duration-200 border border-transparent ${tile.borderColor} hover:scale-[1.02]`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <tile.icon className={`w-5 h-5 ${tile.iconColor}`} />
              </div>
              <p className="text-white font-semibold text-sm">{tile.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {tile.id === 'withdraw' && 'Cash withdrawal'}
                {tile.id === 'deposit' && 'Deposit funds'}
                {tile.id === 'history' && 'View transactions'}
                {tile.id === 'account' && 'Account details'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
