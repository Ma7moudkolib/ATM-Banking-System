import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccountDetailsApi } from '../api/endpoints';
import { formatCurrency } from '../utils/formatCurrency';
import type { AccountDetails } from '../types';
import NavBar from '../components/NavBar';
import {
  ArrowLeft,
  User,
  CreditCard,
  Building2,
  DollarSign,
  Shield,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const { sessionId, logout, customerName, cardNumber } = useAuth();
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);

  function handleLogout() {
    logout();
    navigate('/login');
  }

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

  // Animate progress bar on mount
  useEffect(() => {
    if (account) {
      const target =
        account.dailyWithdrawalLimit > 0
          ? Math.min(100, (account.dailyWithdrawalUsed / account.dailyWithdrawalLimit) * 100)
          : 0;

      const interval = setInterval(() => {
        setProgressWidth((prev) => {
          if (prev < target) {
            return Math.min(prev + 2, target);
          }
          clearInterval(interval);
          return prev;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [account]);

  if (loading) {
    return (
      <>
        <NavBar
          customerName={customerName}
          cardNumber={cardNumber}
          pageTitle="Account"
          onLogout={handleLogout}
        />
        <main className="flex-1 w-full bg-bg-app">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="skeleton w-10 h-10 rounded-lg animate-shimmer" />
              <div className="flex-1">
                <div className="skeleton w-32 h-6 rounded animate-shimmer mb-1.5" />
                <div className="skeleton w-24 h-3 rounded animate-shimmer" />
              </div>
            </div>
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 h-64 skeleton animate-shimmer sm:shadow-cards" />
            <div className="mt-4 bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 h-36 skeleton animate-shimmer sm:shadow-cards" />
          </div>
        </main>
      </>
    );
  }

  if (error || !account) {
    return (
      <>
        <NavBar
          customerName={customerName}
          cardNumber={cardNumber}
          pageTitle="Account"
          onLogout={handleLogout}
        />
        <main className="flex-1 w-full bg-bg-app flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-bg-card border border-border hover:bg-bg-input transition-all duration-200 focus-ring text-text-secondary hover:text-text-primary"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-text-primary">Account Details</h1>
            </div>
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-8 text-center sm:shadow-cards">
              <AlertCircle className="w-10 h-10 text-danger-400 mx-auto mb-3" />
              <p className="text-text-secondary">{error || 'Unable to load account details'}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const isActive = account.cardStatus?.toLowerCase() === 'active';
  const withdrawalPercentage =
    account.dailyWithdrawalLimit > 0
      ? Math.min(100, (account.dailyWithdrawalUsed / account.dailyWithdrawalLimit) * 100)
      : 0;

  return (
    <>
      <NavBar
        customerName={customerName}
        cardNumber={cardNumber}
        pageTitle="Account"
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full bg-bg-app">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-page-in">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-bg-card border border-border hover:bg-bg-input transition-all duration-200 focus-ring text-text-secondary hover:text-text-primary sm:shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                Account
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary/70 mt-0.5">Your profile & details</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 sm:shadow-cards">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 pb-5 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {account.customerName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-text-primary">{account.customerName}</p>
                  <p className="text-xs sm:text-sm text-text-secondary/70">Personal Account</p>
                </div>
              </div>

              {/* Info rows with dividers */}
              <div className="divide-y divide-border">
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
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-text-secondary" />
                    <span className="text-sm text-text-secondary">Card Status</span>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-success-500/10 text-success-400'
                        : 'bg-danger-500/10 text-danger-400'
                    }`}
                  >
                    {isActive ? (
                      <BadgeCheck className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
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
            </div>

            {/* Daily Withdrawal Limit */}
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 sm:shadow-cards">
              <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold mb-5">
                Daily Withdrawal Limit
              </h2>

              {/* Amount row */}
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs text-text-secondary/70 mb-1">Used today</p>
                  <p className="text-3xl sm:text-4xl font-bold text-text-primary font-mono tabular-nums tracking-tight">
                    ${formatCurrency(account.dailyWithdrawalUsed).slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary/70 mb-1">Limit</p>
                  <p className="text-lg sm:text-xl font-semibold text-text-secondary font-mono tabular-nums">
                    ${formatCurrency(account.dailyWithdrawalLimit).slice(1)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-600 ease-out ${
                      withdrawalPercentage >= 80
                        ? 'bg-danger-500'
                        : withdrawalPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-brand-primary to-blue-500'
                    }`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-text-muted font-medium">
                  {withdrawalPercentage.toFixed(0)}% used
                </p>
                <p className="text-xs text-text-secondary font-mono tabular-nums font-medium">
                  ${formatCurrency(Math.max(0, account.dailyWithdrawalLimit - account.dailyWithdrawalUsed)).slice(1)} remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
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
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-text-secondary" />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <span className={`text-sm text-text-primary font-medium ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
