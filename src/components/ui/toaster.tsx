import { useToast } from '../../hooks/useToast';
import { X } from 'lucide-react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Info
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export function Toaster() {
  const { toasts, dismissToast } = useToast();
  
  return (
    <div className="fixed top-0 right-0 z-50 w-full md:max-w-sm p-4 md:p-6 pointer-events-none flex flex-col items-end gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id!)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: {
    id: string;
    title?: string;
    description?: string;
    duration?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
  };
  onDismiss: () => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const getIcon = () => {
    switch (toast.variant) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <div
      className={cn(
        "bg-background border border-border/40 rounded-lg shadow-md p-4 transition-all duration-300 transform pointer-events-auto max-w-full w-full md:w-auto opacity-0 translate-x-4",
        isVisible && "opacity-100 translate-x-0"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          {toast.title && (
            <h4 className="font-medium text-foreground mb-1">{toast.title}</h4>
          )}
          {toast.description && (
            <p className="text-sm text-muted-foreground">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}