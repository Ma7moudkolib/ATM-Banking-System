import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import { maskCardNumber } from '../utils/luhn';
import type { LoginData } from '../types';

interface AuthState {
  sessionId: string;
  customerName: string;
  cardNumber: string;
  accountNumber: string;
  isAuthenticated: boolean;
  cardBlocked: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: LoginData }
  | { type: 'LOGOUT' }
  | { type: 'CARD_BLOCKED' };

interface AuthContextType extends AuthState {
  login: (data: LoginData) => void;
  logout: () => void;
  setCardBlocked: () => void;
}

const initialState: AuthState = {
  sessionId: sessionStorage.getItem('sessionId') || '',
  customerName: sessionStorage.getItem('customerName') || '',
  cardNumber: sessionStorage.getItem('cardNumber') || '',
  accountNumber: sessionStorage.getItem('accountNumber') || '',
  isAuthenticated: !!sessionStorage.getItem('sessionId'),
  cardBlocked: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      const { sessionId, customerName, cardNumber, accountNumber } = action.payload;
      const masked = maskCardNumber(cardNumber);
      sessionStorage.setItem('sessionId', sessionId);
      sessionStorage.setItem('customerName', customerName);
      sessionStorage.setItem('cardNumber', masked);
      sessionStorage.setItem('accountNumber', accountNumber);
      return {
        sessionId,
        customerName,
        cardNumber: masked,
        accountNumber,
        isAuthenticated: true,
        cardBlocked: false,
      };
    }
    case 'LOGOUT':
      sessionStorage.clear();
      return {
        sessionId: '',
        customerName: '',
        cardNumber: '',
        accountNumber: '',
        isAuthenticated: false,
        cardBlocked: false,
      };
    case 'CARD_BLOCKED':
      return { ...state, cardBlocked: true };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((data: LoginData) => {
    dispatch({ type: 'LOGIN', payload: data });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setCardBlocked = useCallback(() => {
    dispatch({ type: 'CARD_BLOCKED' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setCardBlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
