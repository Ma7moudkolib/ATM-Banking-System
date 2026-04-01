import { useState, useCallback } from 'react';
import { getBalanceApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import type { BalanceData } from '../types';

interface UseBalanceReturn {
  balance: BalanceData | null;
  loading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
}

export function useBalance(): UseBalanceReturn {
  const { sessionId } = useAuth();
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getBalanceApi(sessionId);
      if (response.success && response.data) {
        setBalance(response.data);
      } else {
        setError(response.message || 'Failed to fetch balance');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return { balance, loading, error, fetchBalance };
}
