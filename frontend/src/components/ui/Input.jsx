import { useState } from "react";

export default function Input({ label, name, type = "text", value, onChange, error, icon, placeholder, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";
  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <div className={`relative rounded-xl border transition-all duration-200 ${
        error
          ? "border-red-300 bg-red-50/50"
          : isActive
          ? "border-blue-400 bg-white shadow-sm shadow-blue-500/5"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none">
            {icon}
          </div>
        )}
        {label && (
          <label
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              icon ? "left-10" : "left-3"
            } ${
              isActive
                ? "top-1.5 text-[10px] text-blue-600 font-medium"
                : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
            }`}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isActive ? placeholder : ""}
          className={`w-full bg-transparent outline-none transition-all ${
            icon ? "pl-10" : "pl-3"
          } ${label ? "pt-5 pb-2" : "py-2.5"} pr-3 text-sm text-slate-800 placeholder:text-slate-400`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}
