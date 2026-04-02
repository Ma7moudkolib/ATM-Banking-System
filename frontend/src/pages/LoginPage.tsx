import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock } from 'lucide-react';

const VALID_CARDS = [
  { cardNumber: "4532015112830366", pin: "1234", name: "John Doe" },
  { cardNumber: "5425233430109903", pin: "5678", name: "Jane Smith" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
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
  const isFormComplete = cardNumberDigits.length === 16 && pin.every((d) => d.length === 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    const rawPin = pin.join('');
    const match = VALID_CARDS.find(
      (c) => c.cardNumber === cardNumberDigits && c.pin === rawPin
    );

    if (match) {
      navigate('/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-50 lg:bg-white">
      {/* Left Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col items-center justify-center px-8 py-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">NeoATM</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xs">
            Secure banking at your fingertips
          </p>
          <div className="space-y-4 text-sm text-blue-50">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-5 h-5 rounded-full bg-white/30"></div>
              <span>24/7 Access</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-5 h-5 rounded-full bg-white/30"></div>
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-5 h-5 rounded-full bg-white/30"></div>
              <span>Fast Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel / Mobile - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="rounded-2xl bg-blue-600 p-3">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your card details to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number Input */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardChange}
                placeholder="0000-0000-0000-0000"
                className="w-full px-4 py-3 text-lg font-mono tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900 placeholder:text-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 16 digits on your card
              </p>
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                PIN
              </label>
              <div className="flex gap-3">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      pinRefs.current[index] = el;
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="flex-1 w-12 h-14 sm:h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your 4-digit PIN
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm font-medium text-red-700">
                  Invalid card number or PIN. Please try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormComplete}
              className="w-full py-3 px-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg transition-colors duration-200 mt-8"
            >
              Sign In
            </button>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">
                Demo Accounts
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-mono">
                    <span className="font-semibold">Card:</span> 4532 0151 1283 0366
                  </p>
                  <p className="text-xs text-gray-600 font-mono">
                    <span className="font-semibold">PIN:</span> 1234
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-mono">
                    <span className="font-semibold">Card:</span> 5425 2334 3010 9903
                  </p>
                  <p className="text-xs text-gray-600 font-mono">
                    <span className="font-semibold">PIN:</span> 5678
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              <a href="#" className="text-blue-600 hover:underline">
                Need help?
              </a>
              {' • '}
              <a href="#" className="text-blue-600 hover:underline">
                Security Info
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
