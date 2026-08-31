import { useState } from "react";

import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const FormPassword = ({
  field,
  registration,
}) => {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    name,
    label,
    placeholder = "Enter your password",
    disabled = false,
    autoComplete = "new-password",
    inputClassName = "",
  } = field;

  return (
    <div className="space-y-2">
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
        <MdLock className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xl text-gray-400" />

        <input
          id={name}
          type={
            showPassword
              ? "text"
              : "password"
          }
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          {...registration}
          className={`w-full rounded-xl border border-gray-300 ${inputClassName || "py-3"} pl-12 pr-12 outline-none transition-all duration-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
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
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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

export default FormPassword;