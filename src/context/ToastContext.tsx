/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { useTheme } from './ThemeContext';

export type ToastType = 'success' | 'info' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useTheme();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        duration: 3200,
      });
    } else if (type === 'warning') {
      toast.warning(message, {
        duration: 4000,
      });
    } else {
      toast.info(message, {
        duration: 3200,
      });
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        offset={20}
        gap={8}
        toastOptions={{
          style: {
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
            borderRadius: '4px',
            borderWidth: '1px',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          },
          className: 'text-xs sm:text-sm font-medium tracking-tight',
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
