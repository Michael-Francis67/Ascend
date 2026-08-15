import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  onIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      error,
      hint,
      success,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      hintClassName,
      required,
      className,
      type = "text",
      disabled,
      showPasswordToggle,
      onIconClick,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Determine if we should show password toggle
    const isPasswordType = type === "password";
    const shouldShowPasswordToggle = showPasswordToggle && isPasswordType;
    const inputType = isPasswordType && showPassword ? "text" : type;

    // Handle password toggle
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    // Get status styles
    const getStatusStyles = () => {
      if (error)
        return "border-red-500 focus:ring-red-200 focus:border-red-500";
      if (success)
        return "border-green-500 focus:ring-green-200 focus:border-green-500";
      if (isFocused)
        return "border-brand-primary focus:ring-brand-primary/20 focus:border-brand-primary";
      return "border-gray-300 focus:ring-brand-primary/20 focus:border-brand-primary";
    };

    return (
      <div className={cn("space-y-1.5 w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "block text-sm font-medium text-gray-700",
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-all duration-200 outline-none",
              "bg-white text-gray-900 placeholder:text-gray-400",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              (rightIcon || shouldShowPasswordToggle) && "pr-10",
              getStatusStyles(),
              inputClassName,
              className,
            )}
            {...props}
          />

          {/* Right Icon (clickable) */}
          {rightIcon && (
            <button
              type="button"
              onClick={onIconClick}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "text-gray-400 hover:text-gray-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 rounded-lg",
                onIconClick ? "cursor-pointer" : "pointer-events-none",
              )}
            >
              {rightIcon}
            </button>
          )}

          {/* Password Toggle */}
          {shouldShowPasswordToggle && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 rounded-lg p-0.5"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {/* Error Icon */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
              <AlertCircle size={18} />
            </div>
          )}

          {/* Success Indicator */}
          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            className={cn(
              "text-sm text-red-600 flex items-start gap-1",
              errorClassName,
            )}
          >
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Hint Message */}
        {hint && !error && (
          <p className={cn("text-sm text-gray-500", hintClassName)}>{hint}</p>
        )}

        {/* Character Counter */}
        {props.maxLength && (
          <div className="text-xs text-gray-400 text-right">
            {String(props.value || "").length} / {props.maxLength}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
