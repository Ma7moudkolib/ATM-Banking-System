import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import ErrorBanner from '../components/ErrorBanner';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  History,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  FileX,
  RotateCcw,
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
  const { customerName, cardNumber, logout } = useAuth();
  const { transactions, totalPages, totalCount, currentPage, loading, error, fetchTransactions } =
    useTransactions();
  const defaults = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaults.fromDate);
  const [toDate, setToDate] = useState(defaults.toDate);
  const [page, setPage] = useState(1);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    fetchTransactions({ fromDate, toDate, pageNumber: page, pageSize: PAGE_SIZE });
  }, [page, fetchTransactions, fromDate, toDate]);

  function handleSearch() {
    setPage(1);
    fetchTransactions({ fromDate, toDate, pageNumber: 1, pageSize: PAGE_SIZE });
  }

  function handleReset() {
    const newDefaults = getDefaultDates();
    setFromDate(newDefaults.fromDate);
    setToDate(newDefaults.toDate);
    setPage(1);
    fetchTransactions({ 
      fromDate: newDefaults.fromDate, 
      toDate: newDefaults.toDate, 
      pageNumber: 1, 
      pageSize: PAGE_SIZE 
    });
  }

  return (
    <>
      {/* NavBar */}
      <NavBar
        customerName={customerName}
        cardNumber={cardNumber}
        pageTitle="Transaction History"
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 space-y-5 animate-page-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-lg glass-card-light hover:bg-navy-800/60 transition-all duration-200 focus-ring text-text-secondary hover:text-text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-brand-400" />
              History
            </h1>
            <p className="text-xs text-text-secondary/70 mt-0.5">
              {totalCount > 0 ? `${totalCount} transactions` : 'View your activity'}
            </p>
          </div>
        </div>

        {error && (
          <ErrorBanner message={error} onDismiss={() => {}} />
        )}

        {/* Filter Bar */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
              Date Range
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="from-date" className="text-xs text-text-secondary/70 mb-1.5 block font-medium">
                From
              </label>
              <input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg bg-navy-800/50 border border-navy-700/60 text-text-primary text-sm focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 font-mono [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="text-xs text-text-secondary/70 mb-1.5 block font-medium">
                To
              </label>
              <input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg bg-navy-800/50 border border-navy-700/60 text-text-primary text-sm focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 font-mono [color-scheme:dark]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              id="search-history"
              className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all duration-200 focus-ring"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-lg bg-navy-800/40 hover:bg-navy-800/60 text-text-secondary hover:text-text-primary transition-all duration-200 focus-ring"
              aria-label="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transaction List or Empty State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
              <p className="text-text-secondary text-sm">Loading transactions...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-4">
              <FileX className="w-7 h-7 text-brand-400" />
            </div>
            <p className="text-text-primary text-sm font-semibold mb-1">No transactions found</p>
            <p className="text-text-secondary text-xs mb-4">
              Try adjusting your date range or filters
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 text-xs font-medium transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div
                key={tx.transactionReference || i}
                className="animate-slide-in-right"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <TransactionCard transaction={tx} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && transactions.length > 0 && (
          <div className="flex items-center justify-between glass-card-light p-4 border border-navy-700/40">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-navy-700/40 text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-ring"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
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
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-brand-500/25 text-brand-400 border border-brand-500/40'
                        : 'text-text-secondary hover:bg-navy-700/40 border border-transparent hover:border-navy-600/40'
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
              className="p-2 rounded-lg hover:bg-navy-700/40 text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-ring"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
