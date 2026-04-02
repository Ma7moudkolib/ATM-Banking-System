import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Loader2, Eye, EyeOff, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/endpoints';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      const formatted = value.match(/.{1,4}/g)?.join('-') || value;
      setCardNumber(formatted);
      setError(false);
    }
  };

  const handlePinChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digit = val.replace(/\D/g, '').slice(-1);

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError(false);

    if (digit && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const cardNumberDigits = cardNumber.replace(/\D/g, '');
  const isFormComplete = cardNumberDigits.length === 16 && pin.every((d: string) => d.length === 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setLoading(true);
    setError(false);
    
    try {
      const rawPin = pin.join('');
      const response = await loginApi({
        cardNumber: cardNumberDigits,
        pin: rawPin,
      });

      if (response.success && response.data) {
        login(response.data);
        navigate('/dashboard');
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
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
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number Input */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
              >
                Card number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-hint" />
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={handleCardChange}
                  placeholder="0000-0000-0000-0000"
                  className="w-full pl-12 pr-4 py-3 text-center font-mono text-lg tracking-widest border border-border rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary bg-bg-input"
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                PIN
              </label>
              <div className="flex gap-3 justify-center">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) pinRefs.current[index] = el;
                    }}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border border-border rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary bg-bg-input"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-danger rounded-lg">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                <p className="text-sm font-medium text-danger">
                  Invalid card number or PIN. Please try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormComplete || loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
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
