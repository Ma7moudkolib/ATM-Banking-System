import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccountDetailsApi } from '../api/endpoints';
import { formatCurrency } from '../utils/formatCurrency';
import type { AccountDetails } from '../types';
import {
  ArrowLeft,
  User,
  CreditCard,
  Building2,
  DollarSign,
  Shield,
  Loader2,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const { sessionId } = useAuth();
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!sessionId) return;
      try {
        const response = await getAccountDetailsApi(sessionId);
        if (response.success && response.data) {
          setAccount(response.data);
        } else {
          setError(response.message || 'Failed to load account details');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load account details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg glass-card-light hover:bg-navy-600/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <h1 className="text-lg font-bold text-white">Account Details</h1>
        </div>
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-10 h-10 text-accent-red mx-auto mb-3" />
          <p className="text-slate-400">{error || 'Unable to load account details'}</p>
        </div>
      </div>
    );
  }

  const isActive = account.cardStatus?.toLowerCase() === 'active';
  const withdrawalPercentage =
    account.dailyWithdrawalLimit > 0
      ? Math.min(100, (account.dailyWithdrawalUsed / account.dailyWithdrawalLimit) * 100)
      : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg glass-card-light hover:bg-navy-600/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-navy-400" />
            Account Details
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Your profile & card info</p>
        </div>
      </div>

      {/* Customer info card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-navy-600/30">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">{account.customerName}</p>
            <p className="text-xs text-slate-500">Personal Account</p>
          </div>
        </div>

        <DetailRow
          icon={Building2}
          label="Account Number"
          value={account.accountNumber}
          mono
        />
        <DetailRow
          icon={CreditCard}
          label="Card Number"
          value={account.cardNumber}
          mono
        />
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">Card Status</span>
          </div>
          <span
            className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
              isActive
                ? 'bg-emerald-500/15 text-accent-green'
                : 'bg-red-500/15 text-accent-red'
            }`}
          >
            {isActive ? (
              <BadgeCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {account.cardStatus}
          </span>
        </div>
        <DetailRow
          icon={DollarSign}
          label="Currency"
          value={account.currency}
        />
      </div>

      {/* Daily limit */}
      <div className="glass-card p-5">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">
          Daily Withdrawal Limit
        </h2>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-sm text-slate-400">Used today</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(account.dailyWithdrawalUsed)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Limit</p>
            <p className="text-lg font-semibold text-slate-300">
              {formatCurrency(account.dailyWithdrawalLimit)}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-navy-700/80 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              withdrawalPercentage >= 90
                ? 'bg-accent-red'
                : withdrawalPercentage >= 60
                ? 'bg-accent-amber'
                : 'bg-accent-green'
            }`}
            style={{ width: `${withdrawalPercentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">
          {formatCurrency(account.dailyWithdrawalLimit - account.dailyWithdrawalUsed)} remaining
        </p>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <span className={`text-sm text-white ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
