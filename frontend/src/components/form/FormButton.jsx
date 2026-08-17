const FormButton = ({
  children,
  type = "submit",
  loading = false,
  disabled = false,
  fullWidth = true,
  className = "",
}) => {
  const isDisabled =
    loading || disabled;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`flex items-center justify-center gap-3 rounded-xl bg-green-700 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading && (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}

      {loading
        ? children
        : children}
    </button>
  );
};

export default FormButton;