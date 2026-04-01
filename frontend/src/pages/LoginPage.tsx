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
  AlertCircle,
  Phone,
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
  const [pinError, setPinError] = useState(false);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cardNumber: '', pin: '' },
  });

  const pinValue = watch('pin');

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

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.slice(0, 4).replace(/\D/g, '');
    setValue('pin', value, { shouldValidate: false });
    setPinError(false);
  }

  async function onSubmit(data: LoginFormData) {
    if (isBlocked) return;
    setLoading(true);
    setErrorMessage(null);
    setErrorList([]);
    setPinError(false);

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
        setPinError(true);
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
          setPinError(true);
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

  // Blocked state: show blocked panel instead of login form
  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Blocked warning icon */}
        <div className="w-20 h-20 rounded-full bg-danger-500/20 flex items-center justify-center mb-6 animate-fade-in">
          <AlertCircle className="w-10 h-10 text-danger-400" />
        </div>

        {/* Blocked message */}
        <h1 className="text-3xl font-bold text-text-primary text-center mb-3 animate-fade-in">
          Card Blocked
        </h1>
        <p className="text-text-secondary text-center mb-8 max-w-sm animate-fade-in">
          Your card has been locked due to multiple failed login attempts. For security purposes, you will need to contact your bank to unlock your card.
        </p>

        {/* Contact button */}
        <a
          href="tel:+1-800-555-0123"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium transition-all duration-200 mb-6"
        >
          <Phone className="w-4 h-4" />
          Contact Your Bank
        </a>

        {/* Additional info */}
        <p className="text-text-muted text-xs text-center max-w-sm">
          Have any questions? Our support team is available 24/7 to assist you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 min-h-screen">
      {/* Logo section */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center mx-auto mb-4 glow-brand">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm">
          Insert your card details to continue
        </p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm glass-card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            errors={errorList}
            onDismiss={!isBlocked ? () => setErrorMessage(null) : undefined}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Card Number Field */}
          <div className="space-y-2">
            <label
              htmlFor="cardNumber"
              className="text-xs text-text-secondary uppercase tracking-widest font-semibold block"
            >
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={cardInputRef}
                id="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="0000-0000-0000-0000"
                value={cardDisplay}
                onChange={handleCardNumberChange}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-navy-800/50 border border-navy-700/60 text-text-primary font-mono text-base tracking-wider placeholder:text-text-muted/40 focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="cc-number"
              />
            </div>
            {errors.cardNumber && (
              <p className="text-danger-400 text-xs mt-1 font-medium">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          {/* PIN Boxes Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-text-secondary uppercase tracking-widest font-semibold block">
                PIN
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors focus-ring flex items-center gap-1"
                tabIndex={0}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* PIN Box Display */}
            <div className="flex gap-3 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 ${
                    pinError
                      ? 'bg-danger-500/15 border-2 border-danger-400/60 text-danger-400'
                      : index < pinValue.length
                      ? 'bg-brand-500/15 border-2 border-brand-500/60 text-brand-400'
                      : 'bg-navy-800/50 border border-navy-700/60 text-text-muted'
                  }`}
                >
                  {pinValue[index] ? (showPin ? pinValue[index] : '●') : ''}
                </div>
              ))}
            </div>

            {/* Hidden PIN Input */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder=""
              {...register('pin')}
              onChange={handlePinChange}
              ref={pinInputRef}
              disabled={loading}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              autoComplete="off"
            />

            {errors.pin && (
              <p className="text-danger-400 text-xs mt-1 font-medium text-center">
                {errors.pin.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-button"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-ring"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Failed attempts indicator */}
        {failedAttempts > 0 && (
          <div className="mt-6 pt-6 border-t border-navy-700/40 text-center">
            <p className="text-xs text-text-secondary mb-3">
              Security Level:{' '}
              <span className={`font-semibold ${failedAttempts >= 3 ? 'text-danger-400' : failedAttempts >= 2 ? 'text-amber-400' : 'text-text-secondary'}`}>
                {failedAttempts}/3
              </span>
            </p>
            <div className="flex gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < failedAttempts ? 'bg-danger-500/70' : 'bg-navy-700/40'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test credentials */}
      <div className="mt-8 text-center text-xs text-text-muted max-w-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="mb-2 font-medium">Demo Credentials</p>
        <p>Card: <span className="font-mono text-text-secondary">4532-0151-1283-0366</span></p>
        <p>PIN: <span className="font-mono text-text-secondary">1234</span></p>
      </div>
    </div>
  );
}
