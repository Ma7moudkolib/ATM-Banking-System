import apiClient from './axiosInstance';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  AccountBalance,
  AccountDetails,
  TransactionRequest,
  TransactionResponse,
  HistoryRequest,
  TransactionHistoryResponse,
} from '../types';

// Authentication
export async function loginApi(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/authentication/login', data);
  return response.data;
}

export async function validateSessionApi(sessionId: string): Promise<ApiResponse<boolean>> {
  const response = await apiClient.get<ApiResponse<boolean>>(`/authentication/validate/${sessionId}`);
  return response.data;
}

// Account
export async function getBalanceApi(sessionId: string): Promise<ApiResponse<AccountBalance>> {
  const response = await apiClient.get<ApiResponse<AccountBalance>>(`/account/balance/${sessionId}`);
  return response.data;
}

export async function getAccountDetailsApi(sessionId: string): Promise<ApiResponse<AccountDetails>> {
  const response = await apiClient.get<ApiResponse<AccountDetails>>(`/account/details/${sessionId}`);
  return response.data;
}

// Transactions
export async function withdrawApi(data: TransactionRequest): Promise<ApiResponse<TransactionResponse>> {
  const response = await apiClient.post<ApiResponse<TransactionResponse>>('/transaction/withdraw', data);
  return response.data;
}

export async function depositApi(data: TransactionRequest): Promise<ApiResponse<TransactionResponse>> {
  const response = await apiClient.post<ApiResponse<TransactionResponse>>('/transaction/deposit', data);
  return response.data;
}

export async function getTransactionHistoryApi(data: HistoryRequest): Promise<ApiResponse<TransactionHistoryResponse>> {
  const response = await apiClient.post<ApiResponse<TransactionHistoryResponse>>('/transaction/history', data);
  return response.data;
}
