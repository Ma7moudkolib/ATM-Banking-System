import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { withdrawApi } from '../api/endpoints';
import AmountPad from '../components/AmountPad';
import ErrorBanner from '../components/ErrorBanner';
import NavBar from '../components/NavBar';
import {
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  CopyCheck,
} from 'lucide-react';
import type { TransactionData } from '../types';

const QUICK_AMOUNTS = [20, 40, 80, 100, 200, 500];
const ATM_MACHINES = [
  { code: 'ATM001', label: 'ATM001 - Downtown Branch' },
  { code: 'ATM002', label: 'ATM002 - Airport Terminal' },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { sessionId, customerName, cardNumber, logout } = useAuth();
  const { balance, fetchBalance } = useBalance();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [atmCode, setAtmCode] = useState(ATM_MACHINES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [result, setResult] = useState<TransactionData | null>(null);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  function validateAmount(amount: number): string | null {
    if (amount <= 0) return 'Please select an amount';
    if (amount < 20) return 'Minimum withdrawal is $20';
    if (amount > 1000) return 'Maximum withdrawal is $1,000';
    if (amount % 20 !== 0) return 'Amount must be a multiple of $20';
    if (balance && amount > balance.availableBalance) {
      return `Insufficient funds. Available: $${(balance.availableBalance / 100).toFixed(2)}`;
    }
    return null;
  }

  async function handleConfirm() {
    const validationError = validateAmount(selectedAmount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorList([]);

    try {
      const response = await withdrawApi({
        sessionId,
        amount: selectedAmount,
        atmMachineCode: atmCode,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || 'Withdrawal failed');
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
        setError('Withdrawal failed. Please try again.');
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
        <div className="flex-1 flex flex-col items-center justify-center p-4 animate-page-in">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-400" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-text-primary text-center mb-2 font-display">
            Withdrawal Successful
          </h1>
          <p className="text-text-secondary text-sm text-center mb-8">
            Please collect your cash from the ATM
          </p>

          {/* Transaction details card */}
          <div className="glass-card p-6 w-full max-w-sm space-y-4 mb-8">
            <div className="flex items-end justify-between pb-4 border-b border-navy-700/40">
              <span className="text-text-secondary text-sm">Amount</span>
              <span className="text-2xl font-bold text-text-primary font-mono tracking-tight tabular-nums">
                ${(result.amount / 100).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Reference</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 text-xs font-mono transition-all duration-200"
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

            <div className="flex items-center justify-between pt-4 border-t border-navy-700/40">
              <span className="text-text-secondary text-sm">New Balance</span>
              <span className="text-lg font-bold text-text-primary font-mono tabular-nums">
                ${(result.balanceAfter / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => {
                setResult(null);
                setSelectedAmount(0);
                setError(null);
                fetchBalance();
              }}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 focus-ring"
            >
              Another Withdrawal
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-navy-800/60 hover:bg-navy-800/80 text-text-primary font-semibold text-sm transition-all duration-200 border border-navy-700/40 focus-ring"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar
        customerName={customerName}
        cardNumber={cardNumber}
        pageTitle="Withdrawal"
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col p-4 space-y-5 animate-page-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-lg glass-card-light hover:bg-navy-800/60 transition-all duration-200 focus-ring text-text-secondary hover:text-text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-danger-400" />
              Withdraw Cash
            </h1>
            <p className="text-xs text-text-secondary/70 mt-0.5">
              {balance
                ? `Available: $${(balance.availableBalance / 100).toFixed(2)}`
                : 'Loading balance...'}
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

        {/* Available Balance Pill */}
        {balance && (
          <div className="inline-flex px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/30 w-fit">
            <span className="text-xs text-text-secondary/70">Available: </span>
            <span className="text-xs font-bold text-brand-400 ml-1 font-mono">
              ${(balance.availableBalance / 100).toFixed(2)}
            </span>
          </div>
        )}

        {/* Amount Selection Card */}
        <div className="glass-card p-6">
          <h2 className="text-xs text-text-secondary uppercase tracking-widest font-semibold mb-5">
            Enter Amount
          </h2>
          <AmountPad
            onAmountSelected={setSelectedAmount}
            quickAmounts={QUICK_AMOUNTS}
            max={Math.min(1000, balance?.availableBalance ?? 1000)}
            min={20}
            multipleOf={20}
            selectedAmount={selectedAmount}
          />
        </div>

        {/* ATM Location Selection */}
        <div className="glass-card p-6">
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
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                    : 'bg-navy-800/40 border-navy-700/60 text-text-secondary hover:border-brand-500/40'
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
          id="confirm-withdraw"
          onClick={handleConfirm}
          disabled={loading || selectedAmount <= 0}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-danger-600 to-danger-500 hover:from-danger-500 hover:to-danger-400 disabled:from-danger-600/50 disabled:to-danger-500/50 text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-ring glow-danger"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : selectedAmount > 0 ? (
            <>
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw ${(selectedAmount / 100).toFixed(2)}</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4" />
              <span>Select Amount</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
