import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { depositApi } from '../api/endpoints';
import ErrorBanner from '../components/ErrorBanner';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ArrowDownLeft,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Receipt,
  DollarSign,
} from 'lucide-react';
import type { TransactionData } from '../types';

const ATM_MACHINES = [
  { code: 'ATM001', label: 'ATM001 - Downtown Branch' },
  { code: 'ATM002', label: 'ATM002 - Airport Terminal' },
];

export default function DepositPage() {
  const navigate = useNavigate();
  const { sessionId } = useAuth();
  const [amount, setAmount] = useState('');
  const [atmCode, setAtmCode] = useState(ATM_MACHINES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [result, setResult] = useState<TransactionData | null>(null);

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
        amount: num,
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
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent-green" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Deposit Successful</h2>
          <p className="text-slate-400 text-sm mb-6">Your funds have been credited</p>

          <div className="space-y-3 text-left glass-card-light p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount</span>
              <span className="text-accent-green font-semibold">
                +{formatCurrency(result.amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Reference</span>
              <span className="text-slate-300 font-mono text-xs">
                {result.transactionReference}
              </span>
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
              setAmount('');
            }}
            className="flex-1 py-3 rounded-xl glass-card-light text-slate-300 font-medium text-sm hover:bg-navy-600/60 transition-colors flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            New Deposit
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
            <ArrowDownLeft className="w-5 h-5 text-accent-green" />
            Deposit Funds
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Add cash to your account</p>
        </div>
      </div>

      {error && (
        <ErrorBanner message={error} errors={errorList} onDismiss={() => setError(null)} />
      )}

      {/* Amount input */}
      <div className="glass-card p-5">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">
          Enter Amount
        </h2>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-navy-700/60 border border-navy-600/40 text-white text-2xl font-mono placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-500">Min: $1.00</p>
          <p className="text-xs text-slate-500">Max: $10,000.00</p>
        </div>
      </div>

      {/* ATM Selection */}
      <div className="glass-card p-5">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          ATM Location
        </h2>
        <select
          id="deposit-atm-selector"
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
        id="confirm-deposit"
        onClick={handleConfirm}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowDownLeft className="w-4 h-4" />
            Deposit {amount && parseFloat(amount) > 0 ? formatCurrency(parseFloat(amount)) : ''}
          </>
        )}
      </button>
    </div>
  );
}
