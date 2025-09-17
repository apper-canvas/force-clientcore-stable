import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={cn(
          "w-full px-4 py-3 rounded-md border-2 transition-colors duration-200",
          "bg-surface text-primary placeholder-gray-400",
          "border-gray-200 focus:border-accent focus:outline-none",
          error && "border-error focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;