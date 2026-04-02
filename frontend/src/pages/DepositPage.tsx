import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { depositApi } from '../api/endpoints';
import ErrorBanner from '../components/ErrorBanner';
import NavBar from '../components/NavBar';
import {
  ArrowDownLeft,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  CopyCheck,
} from 'lucide-react';
import type { TransactionData } from '../types';

const ATM_MACHINES = [
  { code: 'ATM001', label: 'ATM001 - Downtown Branch' },
  { code: 'ATM002', label: 'ATM002 - Airport Terminal' },
];

export default function DepositPage() {
  const navigate = useNavigate();
  const { sessionId, customerName, cardNumber, logout } = useAuth();
  const [amount, setAmount] = useState('');
  const [atmCode, setAtmCode] = useState(ATM_MACHINES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [result, setResult] = useState<TransactionData | null>(null);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function validateAmount(val: number): string | null {
    if (isNaN(val) || val <= 0) return 'Please enter a valid amount';
    if (val < 1) return 'Minimum deposit is $1';
    if (val > 10000) return 'Maximum deposit is $10,000';
    return null;
  }

  async function handleConfirm() {
    const num = parseFloat(amount);
    const validationError = validateAmount(num);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorList([]);

    try {
      const response = await depositApi({
        sessionId,
        amount: Math.floor(num * 100), // Convert to cents
        atmMachineCode: atmCode,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || 'Deposit failed');
        if (response.errors?.length) {
          setErrorList(response.errors);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        const errWithList = err as Error & { errors?: string[] };
        if (errWithList.errors?.length) {
          setErrorList(errWithList.errors);
        }
      } else {
        setError('Deposit failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (result) {
    const refId = result.transactionReference || '';

    function handleCopy() {
      navigator.clipboard.writeText(refId);
    }

    return (
      <>
        <NavBar
          customerName={customerName}
          cardNumber={cardNumber}
          onLogout={handleLogout}
        />
        <main className="flex-1 w-full bg-bg-app flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-md animate-page-in">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success-400" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-2">
              Deposit Successful
            </h1>
            <p className="text-text-secondary text-sm text-center mb-8">
              Your funds have been credited to your account
            </p>

            {/* Transaction details card */}
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 space-y-4 mb-6 sm:shadow-cards">
              <div className="flex items-end justify-between pb-4 border-b border-border">
                <span className="text-text-secondary text-sm">Amount</span>
                <span className="text-2xl font-bold text-success-400 font-mono tracking-tight tabular-nums">
                  +${(result.amount / 100).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Reference</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-mono transition-all duration-200"
                  title="Copy to clipboard"
                >
                  <span>{refId.slice(0, 12)}...</span>
                  <CopyCheck className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">ATM Location</span>
                <span className="text-text-primary text-sm font-mono">
                  {ATM_MACHINES.find((a) => a.code === atmCode)?.label.split(' - ')[1]}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-text-secondary text-sm">New Balance</span>
                <span className="text-lg font-bold text-text-primary font-mono tabular-nums">
                  ${(result.balanceAfter / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setAmount('');
                  setError(null);
                }}
                className="w-full px-6 py-3 rounded-xl bg-success-600 hover:bg-success-500 text-white font-semibold text-sm transition-all duration-200 focus-ring"
              >
                Another Deposit
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 rounded-xl bg-bg-input hover:bg-border text-text-primary font-semibold text-sm transition-all duration-200 border border-border focus-ring"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar
        customerName={customerName}
        cardNumber={cardNumber}
        pageTitle="Deposit"
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
                <ArrowDownLeft className="w-5 h-5 text-success-400" />
                Deposit Funds
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary/70 mt-0.5">
                Add cash to your account
              </p>
            </div>
          </div>

          {error && (
            <ErrorBanner
              message={error}
              errors={errorList}
              onDismiss={() => setError(null)}
            />
          )}

          <div className="space-y-4">
            {/* Amount Input Card */}
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 sm:shadow-cards">
              <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold mb-5">
                Enter Amount
              </h2>

              {/* Amount input */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-xl">
                  $
                </span>
                <input
                  id="deposit-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(val);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-4 py-3 sm:py-4 rounded-xl text-xl sm:text-2xl font-mono font-bold text-center transition-all duration-200 border ${
                    error
                      ? 'bg-danger-500/10 border-danger-500/40 text-danger-400'
                      : amount && parseFloat(amount) > 0
                      ? 'bg-success-500/10 border-success-500/40 text-success-400'
                      : 'bg-bg-input border-border text-text-primary placeholder:text-text-muted'
                  } focus:ring-2 ${
                    error
                      ? 'focus:ring-danger-500/20'
                      : amount
                      ? 'focus:ring-success-500/20'
                      : 'focus:ring-brand-primary/20'
                  }`}
                />
              </div>

              {/* Limits info */}
              <div className="flex items-center justify-between text-xs text-text-muted/70">
                <span>Min: $1.00</span>
                <span>Max: $10,000.00</span>
              </div>

              {/* Error or validation message */}
              {error && (
                <p className="text-danger-400 text-xs font-medium mt-3 text-center animate-shake">
                  {error}
                </p>
              )}
              {!error && amount && parseFloat(amount) > 0 && (
                <p className="text-success-400 text-xs font-medium mt-3 text-center">
                  ✓ Valid amount
                </p>
              )}
            </div>

            {/* ATM Location Selection */}
            <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 sm:shadow-cards">
              <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select ATM Location
              </h2>
              <div className="space-y-2">
                {ATM_MACHINES.map((atm) => (
                  <button
                    key={atm.code}
                    onClick={() => setAtmCode(atm.code)}
                    className={`w-full p-4 rounded-lg transition-all duration-200 border text-left ${
                      atmCode === atm.code
                        ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                        : 'bg-bg-input border-border text-text-secondary hover:border-brand-primary/40'
                    }`}
                  >
                    <p className="font-medium text-sm">{atm.label}</p>
                    <p className="text-xs text-text-muted mt-1">• Available</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              id="confirm-deposit"
              onClick={handleConfirm}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-success-600 to-success-500 hover:from-success-500 hover:to-success-400 disabled:from-success-600/50 disabled:to-success-500/50 text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-ring"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : amount && parseFloat(amount) > 0 ? (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Deposit ${parseFloat(amount).toFixed(2)}</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Enter Amount</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
