import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

const SESSION_DURATION = 5 * 60; // 5 minutes in seconds
const WARNING_THRESHOLD = 60; // Show warning at 60 seconds

interface SessionState {
  remainingSeconds: number;
  showWarning: boolean;
  isActive: boolean;
}

type SessionAction =
  | { type: 'TICK' }
  | { type: 'RESET' }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'DISMISS_WARNING' };

interface SessionContextType extends SessionState {
  resetTimer: () => void;
  dismissWarning: () => void;
  formattedTime: string;
}

const initialState: SessionState = {
  remainingSeconds: SESSION_DURATION,
  showWarning: false,
  isActive: false,
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'TICK': {
      const newRemaining = state.remainingSeconds - 1;
      return {
        ...state,
        remainingSeconds: Math.max(0, newRemaining),
        showWarning: newRemaining <= WARNING_THRESHOLD && newRemaining > 0,
      };
    }
    case 'RESET':
      return {
        ...state,
        remainingSeconds: SESSION_DURATION,
        showWarning: false,
      };
    case 'START':
      return {
        ...state,
        isActive: true,
        remainingSeconds: SESSION_DURATION,
        showWarning: false,
      };
    case 'STOP':
      return initialState;
    case 'DISMISS_WARNING':
      return { ...state, showWarning: false };
    default:
      return state;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const { isAuthenticated, logout } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop timer based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'START' });
    } else {
      dispatch({ type: 'STOP' });
    }
  }, [isAuthenticated]);

  // Countdown interval
  useEffect(() => {
    if (state.isActive) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isActive]);

  // Auto-logout at 0
  useEffect(() => {
    if (state.remainingSeconds === 0 && state.isActive) {
      logout();
      window.location.href = '/login';
    }
  }, [state.remainingSeconds, state.isActive, logout]);

  // Reset timer on user activity
  const resetTimer = useCallback(() => {
    if (state.isActive) {
      dispatch({ type: 'RESET' });
    }
  }, [state.isActive]);

  // Listen for user interactions to reset the timer
  useEffect(() => {
    if (!state.isActive) return;

    const handleActivity = () => {
      dispatch({ type: 'RESET' });
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [state.isActive]);

  const dismissWarning = useCallback(() => {
    dispatch({ type: 'DISMISS_WARNING' });
  }, []);

  const formattedTime = formatTime(state.remainingSeconds);

  return (
    <SessionContext.Provider
      value={{ ...state, resetTimer, dismissWarning, formattedTime }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
