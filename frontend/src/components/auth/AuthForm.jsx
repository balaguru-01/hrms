import { useState } from "react";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const AuthForm = ({
  email,
  password,
  loading = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  submitText = "Sign In",
  loadingText = "Signing In...",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitDisabled =
    !email.trim() ||
    !password.trim() ||
    loading;

  const handleEmailChange = (event) => {
    onEmailChange?.(event.target.value);
  };

  const handlePasswordChange = (event) => {
    onPasswordChange?.(event.target.value);
  };

  const handleForgotPassword = () => {
    if (loading) {
      return;
    }

    onForgotPassword?.();
  };

  return (
    <form
      // noValidate
      onSubmit={onSubmit}
      autoComplete="off"
      className="space-y-4"
    >
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="enterprise-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>

        <input
          id="enterprise-email"
          type="email"
          name="enterprise-email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          disabled={loading}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="enterprise-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="relative">
          <MdLock className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xl text-gray-400" />

          <input
            id="enterprise-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="enterprise-password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            disabled={loading}
            className="password-input w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none transition-all duration-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            disabled={loading}
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

      {/* Forgot password */}
      <div className="flex items-center justify-end text-sm">
        <button
          type="button"
          className="text-green-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}

        {loading
          ? loadingText
          : submitText}
      </button>
    </form>
  );
};

export default AuthForm;