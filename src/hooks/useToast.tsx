import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ToastContextType {
  showToast: (text: string, type?: ToastType) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto disconnect after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      
      {/* Toast Render Area */}
      <div id="toast-container" className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              id={`toast-${toast.id}`}
              initial={{ opacity: 0, x: 100, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 120, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 w-full p-4 rounded bg-[#2C3318] border-l-4 shadow-xl border-[#3D4A22]"
              style={{
                borderLeftColor: toast.type === 'success' ? '#FF9933' : '#D32F2F', // Saffron for success, Red for error
              }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-[#FF9933]" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-[#D32F2F]" />
                )}
              </div>
              <div className="flex-1 text-[#E8DFB8] font-sans text-sm font-medium pr-2">
                {toast.text}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-[#8A9070] hover:text-[#E8DFB8] transition-colors p-0.5 rounded cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
