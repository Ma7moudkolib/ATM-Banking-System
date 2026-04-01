import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBalance } from '../hooks/useBalance';
import { withdrawApi } from '../api/endpoints';
import AmountPad from '../components/AmountPad';
import ErrorBanner from '../components/ErrorBanner';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Receipt,
} from 'lucide-react';
import type { TransactionData } from '../types';

const QUICK_AMOUNTS = [20, 40, 80, 100, 200, 500];
const ATM_MACHINES = [
  { code: 'ATM001', label: 'ATM001 - Downtown Branch' },
  { code: 'ATM002', label: 'ATM002 - Airport Terminal' },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { sessionId } = useAuth();
  const { balance, fetchBalance } = useBalance();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [atmCode, setAtmCode] = useState(ATM_MACHINES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [result, setResult] = useState<TransactionData | null>(null);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  function validateAmount(amount: number): string | null {
    if (amount <= 0) return 'Please select an amount';
    if (amount < 20) return 'Minimum withdrawal is $20';
    if (amount > 1000) return 'Maximum withdrawal is $1,000';
    if (amount % 20 !== 0) return 'Amount must be a multiple of $20';
    if (balance && amount > balance.availableBalance) {
      return `Insufficient funds. Available: ${formatCurrency(balance.availableBalance)}`;
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
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent-green" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Withdrawal Successful</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please collect your cash
          </p>

          <div className="space-y-3 text-left glass-card-light p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount</span>
              <span className="text-white font-semibold">{formatCurrency(result.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Reference</span>
              <span className="text-slate-300 font-mono text-xs">{result.transactionReference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Previous Balance</span>
              <span className="text-slate-300">{formatCurrency(result.balanceBefore)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-navy-600/50 pt-3">
              <span className="text-slate-400">New Balance</span>
              <span className="text-accent-green font-semibold">
                {formatCurrency(result.balanceAfter)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-accent-green">
                {result.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setResult(null);
              setSelectedAmount(0);
              fetchBalance();
            }}
            className="flex-1 py-3 rounded-xl glass-card-light text-slate-300 font-medium text-sm hover:bg-navy-600/60 transition-colors flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            New Withdrawal
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
            <ArrowUpRight className="w-5 h-5 text-accent-red" />
            Cash Withdrawal
          </h1>
          {balance && (
            <p className="text-xs text-slate-500 mt-0.5">
              Available: {formatCurrency(balance.availableBalance)}
            </p>
          )}
        </div>
      </div>

      {error && (
        <ErrorBanner message={error} errors={errorList} onDismiss={() => setError(null)} />
      )}

      {/* Amount selection */}
      <div className="glass-card p-5">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">
          Select Amount
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

      {/* ATM Selection */}
      <div className="glass-card p-5">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          ATM Location
        </h2>
        <select
          id="atm-selector"
          value={atmCode}
          onChange={(e) => setAtmCode(e.target.value)}
          className="w-full py-3 px-4 rounded-xl bg-navy-700/60 border border-navy-600/40 text-white text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
        >
          {ATM_MACHINES.map((atm) => (
            <option key={atm.code} value={atm.code} className="bg-navy-800">
              {atm.label}
            </option>
          ))}
        </select>
      </div>

      {/* Confirm button */}
      <button
        id="confirm-withdraw"
        onClick={handleConfirm}
        disabled={loading || selectedAmount <= 0}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowUpRight className="w-4 h-4" />
            Withdraw {selectedAmount > 0 ? formatCurrency(selectedAmount) : ''}
          </>
        )}
      </button>
    </div>
  );
}
