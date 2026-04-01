import { useState, useCallback } from 'react';
import { getTransactionHistoryApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import type { TransactionData } from '../types';

interface UseTransactionsReturn {
  transactions: TransactionData[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fetchTransactions: (params: {
    fromDate?: string;
    toDate?: string;
    pageNumber: number;
    pageSize: number;
  }) => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const { sessionId } = useAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (params: {
      fromDate?: string;
      toDate?: string;
      pageNumber: number;
      pageSize: number;
    }) => {
      if (!sessionId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await getTransactionHistoryApi({
          sessionId,
          ...params,
        });
        if (response.success && response.data) {
          setTransactions(response.data.transactions);
          setTotalPages(response.data.totalPages);
          setTotalCount(response.data.totalCount);
          setCurrentPage(response.data.pageNumber);
        } else {
          setError(response.message || 'Failed to fetch transactions');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  return {
    transactions,
    totalPages,
    totalCount,
    currentPage,
    loading,
    error,
    fetchTransactions,
  };
}
