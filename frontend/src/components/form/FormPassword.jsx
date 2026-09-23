import { useState } from "react";

import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const FormPassword = ({
  field,
  registration,
  error,
  formLoading,
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    name,
    label,
    placeholder = "Enter your password",
    disabled = false,
    inputClassName = "",
  } = field;

  const isDisabled =
    disabled || formLoading;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}

        {field.required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {/* Lock Icon */}
        <MdLock className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xl text-gray-400" />

        {/* Password Input */}
        <input
          id={name}
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          disabled={isDisabled}
          {...registration}
          className={`
            w-full
            rounded-xl
            border
            pl-12
            pr-12
            outline-none
            transition-all
            duration-200
            focus:ring-2
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
            [&::-ms-reveal]:hidden
            [&::-ms-clear]:hidden

            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-green-600 focus:ring-green-100"
            }

            ${
              inputClassName || "py-3"
            }
          `}
        />

        {/* Show / Hide Password Button */}
        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (previous) => !previous
            )
          }
          disabled={isDisabled}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? (
            <MdVisibilityOff size={22} />
          ) : (
            <MdVisibility size={22} />
          )}
        </button>
      </div>

      {/* Validation Error */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormPassword;