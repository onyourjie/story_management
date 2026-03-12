import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
            p === page
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
