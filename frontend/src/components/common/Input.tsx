import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
