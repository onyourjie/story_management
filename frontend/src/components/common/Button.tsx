import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center gap-2 font-medium rounded-full transition-colors focus:outline-none";

  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
