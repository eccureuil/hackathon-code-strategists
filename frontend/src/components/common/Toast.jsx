// frontend/src/components/common/Toast.jsx
import { useEffect } from "react";

export const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-up`}
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
};