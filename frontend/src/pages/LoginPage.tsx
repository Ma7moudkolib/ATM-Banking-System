import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/endpoints';
import { formatCardNumber } from '../utils/luhn';
import ErrorBanner from '../components/ErrorBanner';
import {
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Fingerprint,
} from 'lucide-react';

const loginSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform((val) => val.replace(/[\s-]/g, ''))
    .pipe(
      z
        .string()
        .length(16, 'Card number must be 16 digits')
        .regex(/^\d+$/, 'Card number must contain only digits')
    ),
  pin: z
    .string()
    .length(4, 'PIN must be exactly 4 digits')
    .regex(/^\d+$/, 'PIN must contain only digits'),
});

type LoginFormData = z.input<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [cardDisplay, setCardDisplay] = useState('');
  const cardInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cardNumber: '', pin: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = formatCardNumber(raw);
    setCardDisplay(formatted);
    setValue('cardNumber', formatted, { shouldValidate: false });
  }

  async function onSubmit(data: LoginFormData) {
    if (isBlocked) return;
    setLoading(true);
    setErrorMessage(null);
    setErrorList([]);

    try {
      const response = await loginApi({
        cardNumber: data.cardNumber,
        pin: data.pin,
      });

      if (response.success && response.data) {
        login(response.data);
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMessage(response.message || 'Login failed');
        if (response.errors?.length) {
          setErrorList(response.errors);
        }
        handleFailedAttempt();
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status: number; data?: { message?: string; errors?: string[] } } };
        if (axiosErr.response?.status === 401) {
          setErrorMessage('Invalid card number or PIN');
          handleFailedAttempt();
        } else if (axiosErr.response?.status === 403) {
          setErrorMessage('Your card is blocked. Please contact your bank.');
          setIsBlocked(true);
        } else {
          setErrorMessage(axiosErr.response?.data?.message || 'An error occurred');
          if (axiosErr.response?.data?.errors?.length) {
            setErrorList(axiosErr.response.data.errors);
          }
        }
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleFailedAttempt() {
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);
    if (newCount >= 3) {
      setIsBlocked(true);
      setErrorMessage('Too many failed attempts. Your card has been blocked. Please contact your bank.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="animated-bg" />

      {/* Logo */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="relative inline-flex mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center glow-indigo">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-accent-green flex items-center justify-center">
            <Fingerprint className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">SecureATM</h1>
        <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            errors={errorList}
            onDismiss={isBlocked ? undefined : () => setErrorMessage(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Card Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="cardNumber"
              className="text-xs text-slate-400 uppercase tracking-wider font-medium"
            >
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                ref={cardInputRef}
                id="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="0000-0000-0000-0000"
                value={cardDisplay}
                onChange={handleCardNumberChange}
                disabled={isBlocked || loading}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-700/60 border border-navy-600/40 text-white font-mono text-base tracking-wider placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="cc-number"
              />
            </div>
            {errors.cardNumber && (
              <p className="text-accent-red text-xs mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          {/* PIN */}
          <div className="space-y-1.5">
            <label
              htmlFor="pin"
              className="text-xs text-slate-400 uppercase tracking-wider font-medium"
            >
              PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                id="pin"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                {...register('pin')}
                disabled={isBlocked || loading}
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-navy-700/60 border border-navy-600/40 text-white font-mono text-base tracking-[0.4em] text-center placeholder:text-slate-600 placeholder:tracking-[0.2em] focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.pin && (
              <p className="text-accent-red text-xs mt-1">{errors.pin.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-button"
            disabled={isBlocked || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Insert Card & Enter PIN
              </>
            )}
          </button>
        </form>

        {/* Failed attempts indicator */}
        {failedAttempts > 0 && !isBlocked && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Failed attempts:{' '}
              <span className="text-accent-red font-semibold">{failedAttempts}/3</span>
            </p>
            <div className="flex gap-1.5 justify-center mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-colors ${
                    i < failedAttempts ? 'bg-accent-red' : 'bg-navy-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test info */}
      <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-slate-600 text-xs">
          Test Card: <span className="font-mono text-slate-500">4532-0151-1283-0366</span>
        </p>
        <p className="text-slate-600 text-xs">
          PIN: <span className="font-mono text-slate-500">1234</span>
        </p>
      </div>
    </div>
  );
}
