import React from 'react';

// Label Props
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

// Input Props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  helperText?: string;
}

// Label Component
const Label: React.FC<LabelProps> = ({ 
  children, 
  htmlFor, 
  className = "", 
  required = false,
  ...props 
}) => (
  <label 
    htmlFor={htmlFor} 
    className={`text-sm font-medium text-gray-700 ${className}`}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Input Component
const Input: React.FC<InputProps> = ({ 
  className = "", 
  error = false,
  helperText,
  ...props 
}) => {
  const baseStyles = "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all";
  const errorStyles = error 
    ? "border-red-300 focus:ring-red-500" 
    : "border-gray-300 focus:ring-blue-500";

  return (
    <div className="space-y-1">
      <input
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {helperText && (
        <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export { Label, Input };
export type { LabelProps, InputProps };