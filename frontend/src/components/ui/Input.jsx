import { useState } from "react";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon,
  required,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";
  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`
          peer w-full bg-white border-2 rounded-xl px-4 pt-5 pb-2 text-sm text-slate-800
          transition-all duration-200 outline-none
          ${icon ? "pl-10" : ""}
          ${
            error
              ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : focused
                ? "border-indigo-400 shadow-lg shadow-indigo-500/10"
                : "border-slate-200 hover:border-slate-300"
          }
        `}
        {...props}
      />
      {label && (
        <label
          htmlFor={name}
          className={`
            absolute left-0 transition-all duration-200 pointer-events-none
            ${icon ? "ml-10" : "ml-4"}
            ${
              isFloating
                ? "top-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-500"
                : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  icon,
  placeholder = "Sélectionner...",
  required,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";
  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`
          peer w-full bg-white border-2 rounded-xl px-4 pt-5 pb-2 text-sm text-slate-800
          transition-all duration-200 outline-none cursor-pointer
          ${!hasValue ? "text-slate-400" : ""}
          ${icon ? "pl-10" : ""}
          ${
            error
              ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : focused
                ? "border-indigo-400 shadow-lg shadow-indigo-500/10"
                : "border-slate-200 hover:border-slate-300"
          }
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {label && (
        <label
          htmlFor={name}
          className={`
            absolute left-0 transition-all duration-200 pointer-events-none
            ${icon ? "ml-10" : "ml-4"}
            ${
              isFloating
                ? "top-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-500"
                : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
