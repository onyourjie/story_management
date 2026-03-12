import React from "react";

interface BadgeProps {
  label: string;
  variant?: "default" | "publish" | "draft";
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = "default", onRemove }) => {
  const styles = {
    default: "bg-gray-200 text-gray-700",
    publish: "bg-green-100 text-green-700 border border-green-300",
    draft: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Badge;
