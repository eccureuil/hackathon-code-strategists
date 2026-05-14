import { useState } from "react";

export default function Input({
  label,
  error,
  name,
  type = "text",
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          peer w-full border rounded-lg px-3 pt-5 pb-2 text-sm
          transition-all duration-200 outline-none
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          }
          disabled:bg-slate-50 disabled:text-slate-400
          ${className}
        `}
        {...props}
      />
      <label
        htmlFor={name}
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${
            error ? "text-red-500" : "text-slate-500"
          }
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-emerald-600
          ${focused || props.value ? "top-1 text-xs" : ""}
        `}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
