import { useState } from "react";

const variants = {
  primary:
    "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100",
  success:
    "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]",
  outline:
    "bg-transparent text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 active:bg-indigo-100",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  disabled,
  className = "",
  fullWidth,
  pill,
  ...props
}) {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
    props.onClick?.(e);
  };

  return (
    <button
      className={`
        relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 cursor-pointer select-none
        ${fullWidth ? "w-full" : ""}
        ${pill ? "rounded-full" : "rounded-xl"}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {ripple && (
        <span
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
            width: 16,
            height: 16,
            animation: "scale-in 0.6s ease-out forwards",
          }}
        />
      )}
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
