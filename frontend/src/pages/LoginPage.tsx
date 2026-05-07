import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff, CreditCard } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/endpoints';
import ErrorBanner from '../components/ErrorBanner';

const loginSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be exactly 16 digits').max(16),
  pin: z.string().length(4, 'PIN must be exactly 4 digits'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPin, setShowPin] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiErrorList, setApiErrorList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cardNumber: '',
      pin: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setApiError(null);
    setApiErrorList([]);

    try {
      const response = await loginApi({
        cardNumber: data.cardNumber,
        pin: data.pin,
      });

      if (response.success && response.data) {
        login(response.data);
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Login failed');
        if (response.errors?.length) {
          setApiErrorList(response.errors);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
        const errWithList = err as Error & { errors?: string[] };
        if (errWithList.errors?.length) {
          setApiErrorList(errWithList.errors);
          
          // Map backend errors to form fields if possible
          errWithList.errors.forEach(e => {
            if (e.toLowerCase().includes('card')) {
              setError('cardNumber', { type: 'server', message: e });
            } else if (e.toLowerCase().includes('pin')) {
              setError('pin', { type: 'server', message: e });
            }
          });
        }
      } else {
        setApiError('Invalid card number or PIN. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-app flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm sm:max-w-lg lg:max-w-md">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-600 text-white mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Welcome back
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-card rounded-none sm:rounded-2xl p-6 sm:p-8 sm:shadow-cards animate-slide-up">
          {apiError && (
            <div className="mb-6">
              <ErrorBanner
                message={apiError}
                errors={apiErrorList}
                onDismiss={() => setApiError(null)}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card Number Input */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
              >
                Card number
              </label>
              <Controller
                name="cardNumber"
                control={control}
                render={({ field }) => {
                  const displayValue = field.value.match(/.{1,4}/g)?.join('-') || field.value;
                  return (
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-hint" />
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        value={displayValue}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          field.onChange(val);
                        }}
                        placeholder="0000-0000-0000-0000"
                        className={`w-full pl-12 pr-4 py-3 text-center font-mono text-lg tracking-widest border rounded-xl focus:ring-2 bg-bg-input ${
                          errors.cardNumber
                            ? 'border-danger focus:border-danger focus:ring-danger/20'
                            : 'border-border focus:border-brand-primary focus:ring-brand-secondary'
                        }`}
                      />
                    </div>
                  );
                }}
              />
              {errors.cardNumber && (
                <p className="mt-2 text-xs text-danger">{errors.cardNumber.message}</p>
              )}
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                PIN
              </label>
              <Controller
                name="pin"
                control={control}
                render={({ field }) => {
                  const pinArray = field.value.split('');
                  // Ensure array has 4 elements
                  while (pinArray.length < 4) pinArray.push('');

                  return (
                    <div className="flex gap-3 justify-center">
                      {pinArray.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            if (el) pinRefs.current[index] = el;
                          }}
                          type={showPin ? 'text' : 'password'}
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(-1);
                            const newPinArray = [...pinArray];
                            newPinArray[index] = val;
                            field.onChange(newPinArray.join(''));

                            if (val && index < 3) {
                              pinRefs.current[index + 1]?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && index > 0) {
                              pinRefs.current[index - 1]?.focus();
                            }
                          }}
                          className={`w-14 h-14 text-center text-2xl font-bold border rounded-xl focus:ring-2 bg-bg-input ${
                            errors.pin
                              ? 'border-danger focus:border-danger focus:ring-danger/20'
                              : 'border-border focus:border-brand-primary focus:ring-brand-secondary'
                          }`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="flex items-center justify-center w-14 h-14 text-text-hint hover:text-text-primary transition-colors"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                }}
              />
              {errors.pin && <p className="mt-2 text-xs text-danger text-center">{errors.pin.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-text-hint uppercase tracking-wider mb-4 text-center">
                Demo Accounts
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-bg-input rounded-lg border border-border text-center">
                  <p className="text-xs text-text-secondary font-mono">
                    4532 0151 1283 0366 • PIN: 1234
                  </p>
                </div>
                <div className="p-3 bg-bg-input rounded-lg border border-border text-center">
                  <p className="text-xs text-text-secondary font-mono">
                    5425 2334 3010 9903 • PIN: 5678
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
