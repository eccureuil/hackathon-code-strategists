/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useCallback } from "react";

let toastListeners = [];
let toastId = 0;

export function showToast(message, type = "success") {
  const id = ++toastId;
  toastListeners.forEach((fn) => fn({ id, message, type }));
  return id;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== addToast); };
  }, [addToast]);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const typeStyles = {
    success: "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-500/20",
    error: "bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/20",
    info: "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto toast-enter flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium min-w-[280px] max-w-sm cursor-pointer ${typeStyles[toast.type] || typeStyles.success}`}
          onClick={() => removeToast(toast.id)}
        >
          {icons[toast.type] || icons.success}
          <span className="flex-1">{toast.message}</span>
          <button className="opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
