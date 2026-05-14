import React from "react";

const toastListeners = [];
const toastTimers = new Map();
let toastId = 0;

export function showToast(message, type = "info", duration = 3500) {
  const id = ++toastId;
  toastListeners.forEach((fn) => fn({ id, message, type }));
  const timer = setTimeout(() => {
    toastListeners.forEach((fn) => fn({ id, message: null, type: null }));
    toastTimers.delete(id);
  }, duration);
  toastTimers.set(id, timer);
}

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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

const styles = {
  success: "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30",
  error: "bg-linear-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/30",
  info: "bg-linear-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30",
  warning: "bg-linear-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30",
};

export function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => {
        if (!toast.message) return prev.filter((t) => t.id !== toast.id);
        return [...prev, toast];
      });
    };
    toastListeners.push(handler);
    return () => {
      const idx = toastListeners.indexOf(handler);
      if (idx > -1) toastListeners.splice(idx, 1);
    };
  }, []);

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimers.get(id);
    if (timer) { clearTimeout(timer); toastTimers.delete(id); }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto toast-enter ${styles[toast.type] || styles.info} rounded-2xl px-4 py-3 flex items-center gap-3 text-white shadow-xl`}
        >
          <span className="flex-shrink-0">{icons[toast.type] || icons.info}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => remove(toast.id)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
