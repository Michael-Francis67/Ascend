import React, { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      containerClassName,
      labelClassName,
      selectClassName,
      className,
      required,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-1.5 w-full", containerClassName)}>
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

        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            value={value}
            className={cn(
              "w-full px-4 py-2.5 pr-10 rounded-lg border transition-all duration-200 outline-none",
              "bg-white text-gray-900 appearance-none",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-brand-primary/20 focus:border-brand-primary",
              selectClassName,
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200",
              error ? "text-red-500" : "text-gray-400",
              disabled && "opacity-50",
            )}
            size={18}
          />

          {error && (
            <AlertCircle
              className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"
              size={18}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-start gap-1">
            <span>{error}</span>
          </p>
        )}

        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
