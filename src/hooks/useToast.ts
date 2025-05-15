import { useState, useCallback } from 'react';

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(
    ({ title, description, duration = 5000, variant = 'default' }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, description, duration, variant };
      
      setToasts((prevToasts) => [...prevToasts, newToast]);
      
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      }, duration);
      
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toast, toasts, dismissToast };
}