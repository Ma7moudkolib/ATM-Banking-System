import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import NavBar from './NavBar';

export default function Layout() {
  const { isAuthenticated, customerName, cardNumber, logout, cardBlocked } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Card blocked banner */}
      {cardBlocked && (
        <div className="bg-danger-500/20 border-b border-danger-500/30 px-4 py-3 text-center text-danger-400 text-sm font-medium animate-slide-down">
          <AlertTriangle className="w-4 h-4 inline-block mr-2" />
          Your card has been blocked. Please contact your bank.
        </div>
      )}

      {/* Top nav bar */}
      {isAuthenticated && (
        <NavBar
          customerName={customerName}
          cardNumber={cardNumber}
          onLogout={handleLogout}
        />
      )}

      {/* Main content */}
      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
