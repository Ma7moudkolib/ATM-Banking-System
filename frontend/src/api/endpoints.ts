import apiClient from './client';
import { mockApi } from './mockData';
import type {
  ApiResponse,
  LoginRequest,
  LoginData,
  BalanceData,
  AccountDetails,
  TransactionRequest,
  TransactionData,
  HistoryRequest,
  HistoryData,
} from '../types';

// Use mock data if VITE_USE_MOCK_API is set to 'true'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper to create API response from mock data
function createResponse<T>(success: boolean, data: T | null, message: string = ''): ApiResponse<T> {
  return {
    success,
    message: message || (success ? 'Success' : 'Error'),
    data: (success ? data : null) as T | null,
    errors: [],
    timestamp: new Date().toISOString(),
  };
}

// Authentication
export async function loginApi(data: LoginRequest): Promise<ApiResponse<LoginData>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.login(data.cardNumber, data.pin);
        if (result) {
          resolve(createResponse(true, result, 'Login successful'));
        } else {
          resolve(createResponse<LoginData>(false, null, 'Invalid card number or PIN'));
        }
      }, 500); // Simulate network delay
    });
  }

  const response = await apiClient.post<ApiResponse<LoginData>>('/authentication/login', data);
  return response.data;
}

export async function validateSessionApi(sessionId: string): Promise<ApiResponse<boolean>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = mockApi.validateSession(sessionId);
        resolve(createResponse(isValid, isValid, isValid ? 'Session valid' : 'Session expired'));
      }, 200);
    });
  }

  const response = await apiClient.get<ApiResponse<boolean>>(`/authentication/validate/${sessionId}`);
  return response.data;
}

// Account
export async function getBalanceApi(sessionId: string): Promise<ApiResponse<BalanceData>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.getBalance(sessionId);
        if (result) {
          resolve(createResponse(true, result, 'Balance retrieved'));
        } else {
          resolve(createResponse<BalanceData>(false, null, 'Unable to retrieve balance'));
        }
      }, 300);
    });
  }

  const response = await apiClient.get<ApiResponse<BalanceData>>(`/account/balance/${sessionId}`);
  return response.data;
}

export async function getAccountDetailsApi(sessionId: string): Promise<ApiResponse<AccountDetails>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.getAccountDetails(sessionId);
        if (result) {
          resolve(createResponse(true, result, 'Account details retrieved'));
        } else {
          resolve(createResponse<AccountDetails>(false, null, 'Unable to retrieve account details'));
        }
      }, 300);
    });
  }

  const response = await apiClient.get<ApiResponse<AccountDetails>>(`/account/details/${sessionId}`);
  return response.data;
}

// Transactions
export async function withdrawApi(data: TransactionRequest): Promise<ApiResponse<TransactionData>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.withdraw(data.sessionId, data.amount, data.atmMachineCode);
        if (result) {
          resolve(createResponse(true, result, 'Withdrawal successful'));
        } else {
          resolve(createResponse<TransactionData>(false, null, 'Withdrawal failed - insufficient funds or invalid session'));
        }
      }, 500);
    });
  }

  const response = await apiClient.post<ApiResponse<TransactionData>>('/transaction/withdraw', data);
  return response.data;
}

export async function depositApi(data: TransactionRequest): Promise<ApiResponse<TransactionData>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.deposit(data.sessionId, data.amount, data.atmMachineCode);
        if (result) {
          resolve(createResponse(true, result, 'Deposit successful'));
        } else {
          resolve(createResponse<TransactionData>(false, null, 'Deposit failed - invalid session'));
        }
      }, 500);
    });
  }

  const response = await apiClient.post<ApiResponse<TransactionData>>('/transaction/deposit', data);
  return response.data;
}

export async function getTransactionHistoryApi(data: HistoryRequest): Promise<ApiResponse<HistoryData>> {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockApi.getTransactionHistory(
          data.sessionId,
          data.fromDate,
          data.toDate,
          data.pageNumber,
          data.pageSize
        );
        if (result) {
          resolve(createResponse(true, result, 'History retrieved'));
        } else {
          resolve(createResponse<HistoryData>(false, null, 'Unable to retrieve history'));
        }
      }, 400);
    });
  }

  const response = await apiClient.post<ApiResponse<HistoryData>>('/transaction/history', data);
  return response.data;
}
