import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  success?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  required?: boolean;
  rows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      success,
      containerClassName,
      labelClassName,
      textareaClassName,
      className,
      required,
      rows = 4,
      disabled,
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

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border transition-all duration-200 outline-none",
            "bg-white text-gray-900 placeholder:text-gray-400 resize-y",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus:ring-red-200 focus:border-red-500"
              : success
                ? "border-green-500 focus:ring-green-200 focus:border-green-500"
                : "border-gray-300 focus:ring-brand-primary/20 focus:border-brand-primary",
            textareaClassName,
            className,
          )}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600 flex items-start gap-1">
            <span>{error}</span>
          </p>
        )}

        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}

        {props.maxLength && (
          <div className="text-xs text-gray-400 text-right">
            {String(props.value || "").length} / {props.maxLength}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
