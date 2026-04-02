import type {
  LoginData,
  BalanceData,
  AccountDetails,
  TransactionData,
  HistoryData,
} from '../types';

// Mock credentials
const MOCK_USERS = [
  {
    cardNumber: '4532015112830366',
    pin: '1234',
    sessionId: 'SESSION-001',
    accountNumber: 'ACC-001',
    customerName: 'John Doe',
  },
  {
    cardNumber: '5425233430109903',
    pin: '5678',
    sessionId: 'SESSION-002',
    accountNumber: 'ACC-002',
    customerName: 'Jane Smith',
  },
];

// Mock balance data
const MOCK_BALANCES: Record<string, BalanceData> = {
  'ACC-001': {
    accountNumber: 'ACC-001',
    availableBalance: 250500, // $2,505.00
    currency: 'USD',
    inquiryDate: new Date().toISOString(),
  },
  'ACC-002': {
    accountNumber: 'ACC-002',
    availableBalance: 180000, // $1,800.00
    currency: 'USD',
    inquiryDate: new Date().toISOString(),
  },
};

// Mock account details
const MOCK_ACCOUNT_DETAILS: Record<string, AccountDetails> = {
  'ACC-001': {
    customerName: 'John Doe',
    accountNumber: 'ACC-001',
    cardNumber: '4532-0151-1283-0366',
    cardStatus: 'Active',
    currency: 'USD',
    dailyWithdrawalLimit: 100000, // $1,000.00
    dailyWithdrawalUsed: 45000, // $450.00
  },
  'ACC-002': {
    customerName: 'Jane Smith',
    accountNumber: 'ACC-002',
    cardNumber: '5425-2334-3010-9903',
    cardStatus: 'Active',
    currency: 'USD',
    dailyWithdrawalLimit: 100000, // $1,000.00
    dailyWithdrawalUsed: 25000, // $250.00
  },
};

// Mock transactions
const MOCK_TRANSACTIONS: Record<string, TransactionData[]> = {
  'ACC-001': [
    {
      transactionReference: 'TXN20260402001',
      type: 'Withdrawal',
      amount: 10000, // $100.00
      currency: 'USD',
      balanceBefore: 260500,
      balanceAfter: 250500,
      transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260401001',
      type: 'Deposit',
      amount: 50000, // $500.00
      currency: 'USD',
      balanceBefore: 210500,
      balanceAfter: 260500,
      transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260331001',
      type: 'Withdrawal',
      amount: 20000, // $200.00
      currency: 'USD',
      balanceBefore: 230500,
      balanceAfter: 210500,
      transactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260330001',
      type: 'Withdrawal',
      amount: 15000, // $150.00
      currency: 'USD',
      balanceBefore: 245500,
      balanceAfter: 230500,
      transactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260329001',
      type: 'Deposit',
      amount: 100000, // $1,000.00
      currency: 'USD',
      balanceBefore: 145500,
      balanceAfter: 245500,
      transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
  ],
  'ACC-002': [
    {
      transactionReference: 'TXN20260402002',
      type: 'Withdrawal',
      amount: 25000, // $250.00
      currency: 'USD',
      balanceBefore: 205000,
      balanceAfter: 180000,
      transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260401002',
      type: 'Deposit',
      amount: 75000, // $750.00
      currency: 'USD',
      balanceBefore: 130000,
      balanceAfter: 205000,
      transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
    {
      transactionReference: 'TXN20260331002',
      type: 'Withdrawal',
      amount: 30000, // $300.00
      currency: 'USD',
      balanceBefore: 160000,
      balanceAfter: 130000,
      transactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
    },
  ],
};

interface SessionData {
  sessionId: string;
  accountNumber: string;
  customerName: string;
  cardNumber: string;
  expiresAt: string;
}

// In-memory session storage for mock
const MOCK_SESSIONS: Record<string, SessionData> = {};

export const mockApi = {
  login: (cardNumber: string, pin: string): LoginData | null => {
    const user = MOCK_USERS.find(
      (u) => u.cardNumber === cardNumber && u.pin === pin
    );
    if (!user) return null;

    const sessionId = `SESSION-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    MOCK_SESSIONS[sessionId] = {
      sessionId,
      accountNumber: user.accountNumber,
      customerName: user.customerName,
      cardNumber: user.cardNumber,
      expiresAt,
    };

    return {
      sessionId,
      cardNumber: user.cardNumber,
      accountNumber: user.accountNumber,
      customerName: user.customerName,
      expiresAt,
    };
  },

  validateSession: (sessionId: string): boolean => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return false;
    return new Date(session.expiresAt) > new Date();
  },

  getBalance: (sessionId: string): BalanceData | null => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return null;
    return MOCK_BALANCES[session.accountNumber] || null;
  },

  getAccountDetails: (sessionId: string): AccountDetails | null => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return null;
    return MOCK_ACCOUNT_DETAILS[session.accountNumber] || null;
  },

  withdraw: (
    sessionId: string,
    amount: number,
    _atmCode: string
  ): TransactionData | null => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return null;

    const accountNum = session.accountNumber;
    const balance = MOCK_BALANCES[accountNum];
    if (!balance || balance.availableBalance < amount) return null;

    const balanceBefore = balance.availableBalance;
    const balanceAfter = balanceBefore - amount;
    balance.availableBalance = balanceAfter;

    const transaction: TransactionData = {
      transactionReference: `TXN${Date.now()}`,
      type: 'Withdrawal',
      amount,
      currency: 'USD',
      balanceBefore,
      balanceAfter,
      transactionDate: new Date().toISOString(),
      status: 'Completed',
    };

    MOCK_TRANSACTIONS[accountNum]?.unshift(transaction);

    return transaction;
  },

  deposit: (
    sessionId: string,
    amount: number,
    _atmCode: string
  ): TransactionData | null => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return null;

    const accountNum = session.accountNumber;
    const balance = MOCK_BALANCES[accountNum];
    if (!balance) return null;

    const balanceBefore = balance.availableBalance;
    const balanceAfter = balanceBefore + amount;
    balance.availableBalance = balanceAfter;

    const transaction: TransactionData = {
      transactionReference: `TXN${Date.now()}`,
      type: 'Deposit',
      amount,
      currency: 'USD',
      balanceBefore,
      balanceAfter,
      transactionDate: new Date().toISOString(),
      status: 'Completed',
    };

    MOCK_TRANSACTIONS[accountNum]?.unshift(transaction);

    return transaction;
  },

  getTransactionHistory: (
    sessionId: string,
    fromDate?: string,
    toDate?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): HistoryData | null => {
    const session = MOCK_SESSIONS[sessionId];
    if (!session) return null;

    const accountNum = session.accountNumber;
    let transactions = MOCK_TRANSACTIONS[accountNum] || [];

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      transactions = transactions.filter(
        (t) => new Date(t.transactionDate).getTime() >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate).getTime();
      transactions = transactions.filter(
        (t) => new Date(t.transactionDate).getTime() <= to
      );
    }

    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (pageNumber - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedTransactions = transactions.slice(startIdx, endIdx);

    return {
      transactions: paginatedTransactions,
      totalCount,
      pageNumber,
      pageSize,
      totalPages,
    };
  },
};
