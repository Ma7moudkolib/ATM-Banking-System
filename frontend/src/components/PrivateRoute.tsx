import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateSessionApi } from '../api/endpoints';
import { Shield, Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, sessionId, logout } = useAuth();
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function validate() {
      if (!isAuthenticated || !sessionId) {
        setValidating(false);
        setIsValid(false);
        return;
      }

      try {
        const response = await validateSessionApi(sessionId);
        if (response.success) {
          setIsValid(true);
        } else {
          logout();
          setIsValid(false);
        }
      } catch {
        logout();
        setIsValid(false);
      } finally {
        setValidating(false);
      }
    }

    validate();
  }, [isAuthenticated, sessionId, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="relative inline-flex mb-4">
            <Shield className="w-12 h-12 text-brand-400" />
            <Loader2 className="w-6 h-6 text-brand-400 absolute -bottom-1 -right-1 animate-spin" />
          </div>
          <p className="text-text-secondary text-sm">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
