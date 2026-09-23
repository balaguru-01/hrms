import { useState } from "react";
import {
  MdVisibility,
  MdVisibilityOff,
  MdLock,
} from "react-icons/md";

const PasswordField = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete = "new-password",
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <MdLock
          className="
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-xl
            text-gray-400
          "
        />

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="enterprise-password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="
            password-input
            w-full
            rounded-xl
            border
            border-gray-300
            py-3
            pl-12
            pr-12
            outline-none
            transition-all
            duration-200
            focus:border-green-600
            focus:ring-2
            focus:ring-green-100
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (previous) => !previous
            )
          }
          disabled={disabled}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-4
            top-1/2
            z-10
            -translate-y-1/2
            text-gray-500
            transition
            hover:text-gray-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {showPassword ? (
            <MdVisibilityOff size={22} />
          ) : (
            <MdVisibility size={22} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;