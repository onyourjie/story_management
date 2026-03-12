import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10 ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          ▼
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
