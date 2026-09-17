import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  icon,
  autoComplete = "off",
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full
            rounded-xl
            border
            border-gray-300
            py-3
            outline-none
            transition-all
            duration-200
            ${icon ? "pl-12 pr-4" : "px-4"}
            focus:border-green-600
            focus:ring-2
            focus:ring-green-100
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
          `}
        />
      </div>
    </div>
  );
};

export default InputField;