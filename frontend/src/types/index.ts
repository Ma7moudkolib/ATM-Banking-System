// API response types matching the ASP.NET Core API shape

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
  timestamp: string;
}

export interface LoginRequest {
  cardNumber: string;
  pin: string;
}

export interface LoginData {
  sessionId: string;
  cardNumber: string;
  accountNumber: string;
  customerName: string;
  expiresAt: string;
}

export interface BalanceData {
  accountNumber: string;
  availableBalance: number;
  currency: string;
  inquiryDate: string;
}

export interface AccountDetails {
  customerName: string;
  accountNumber: string;
  cardNumber: string;
  cardStatus: string;
  currency: string;
  dailyWithdrawalLimit: number;
  dailyWithdrawalUsed: number;
}

export interface TransactionRequest {
  sessionId: string;
  amount: number;
  atmMachineCode: string;
}

export interface TransactionData {
  transactionReference: string;
  type: string;
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  transactionDate: string;
  status: string;
}

export interface HistoryRequest {
  sessionId: string;
  fromDate?: string;
  toDate?: string;
  pageNumber: number;
  pageSize: number;
}

export interface HistoryData {
  transactions: TransactionData[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
