import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CardBlockedModalProps {
  message: string;
  onClose: () => void;
}

export default function CardBlockedModal({ message, onClose }: CardBlockedModalProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card border border-danger-500/20 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up relative overflow-hidden">
        {/* Red top border highlight */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-danger-500" />
        
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-danger-500/10 flex items-center justify-center mb-5">
          <AlertTriangle className="w-8 h-8 text-danger-500" />
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-2">Card Blocked</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleClose}
          className="w-full py-3 px-4 bg-bg-input hover:bg-border text-text-primary font-semibold rounded-xl transition-colors border border-border"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}
