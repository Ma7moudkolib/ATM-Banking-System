import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import ErrorBanner from '../components/ErrorBanner';
import {
  ArrowLeft,
  History,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  Receipt,
} from 'lucide-react';

const PAGE_SIZE = 10;

function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    fromDate: from.toISOString().split('T')[0],
    toDate: to.toISOString().split('T')[0],
  };
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { transactions, totalPages, totalCount, currentPage, loading, error, fetchTransactions } =
    useTransactions();
  const defaults = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaults.fromDate);
  const [toDate, setToDate] = useState(defaults.toDate);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions({ fromDate, toDate, pageNumber: page, pageSize: PAGE_SIZE });
  }, [page, fetchTransactions, fromDate, toDate]);

  function handleSearch() {
    setPage(1);
    fetchTransactions({ fromDate, toDate, pageNumber: 1, pageSize: PAGE_SIZE });
  }

  return (
    <div className="space-y-5 animate-fade-in">
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
            <History className="w-5 h-5 text-accent-blue" />
            Transaction History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalCount > 0 ? `${totalCount} transactions found` : 'View your recent activity'}
          </p>
        </div>
      </div>

      {/* Date filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Date Range
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="from-date" className="text-xs text-slate-500 mb-1 block">
              From
            </label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-navy-700/60 border border-navy-600/40 text-white text-sm focus:border-indigo-500/50 transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="text-xs text-slate-500 mb-1 block">
              To
            </label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-navy-700/60 border border-navy-600/40 text-white text-sm focus:border-indigo-500/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          id="search-history"
          className="mt-3 w-full py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => {}} />}

      {/* Transaction list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No transactions found</p>
          <p className="text-slate-600 text-xs mt-1">
            Try adjusting your date range
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx, i) => (
            <div key={tx.transactionReference || i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <TransactionCard transaction={tx} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between glass-card-light p-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg hover:bg-navy-600/60 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-navy-600/60'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg hover:bg-navy-600/60 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
