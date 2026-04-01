import apiClient from './client';
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

// Authentication
export async function loginApi(data: LoginRequest): Promise<ApiResponse<LoginData>> {
  const response = await apiClient.post<ApiResponse<LoginData>>('/authentication/login', data);
  return response.data;
}

export async function validateSessionApi(sessionId: string): Promise<ApiResponse<boolean>> {
  const response = await apiClient.get<ApiResponse<boolean>>(`/authentication/validate/${sessionId}`);
  return response.data;
}

// Account
export async function getBalanceApi(sessionId: string): Promise<ApiResponse<BalanceData>> {
  const response = await apiClient.get<ApiResponse<BalanceData>>(`/account/balance/${sessionId}`);
  return response.data;
}

export async function getAccountDetailsApi(sessionId: string): Promise<ApiResponse<AccountDetails>> {
  const response = await apiClient.get<ApiResponse<AccountDetails>>(`/account/details/${sessionId}`);
  return response.data;
}

// Transactions
export async function withdrawApi(data: TransactionRequest): Promise<ApiResponse<TransactionData>> {
  const response = await apiClient.post<ApiResponse<TransactionData>>('/transaction/withdraw', data);
  return response.data;
}

export async function depositApi(data: TransactionRequest): Promise<ApiResponse<TransactionData>> {
  const response = await apiClient.post<ApiResponse<TransactionData>>('/transaction/deposit', data);
  return response.data;
}

export async function getTransactionHistoryApi(data: HistoryRequest): Promise<ApiResponse<HistoryData>> {
  const response = await apiClient.post<ApiResponse<HistoryData>>('/transaction/history', data);
  return response.data;
}
