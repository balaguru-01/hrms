const PrimaryButton = ({
  text,
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = true,
  className = "",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${fullWidth ? "w-full" : "w-fit"}
        rounded-xl
        bg-green-700
        py-3
        text-white
        font-semibold
        transition-all
        duration-300

        hover:bg-green-800

        disabled:bg-gray-400
        disabled:cursor-not-allowed

        flex
        justify-center
        items-center
        gap-3

        ${className}
      `}
    >
      {loading ? (
        <div
          className="
            h-5
            w-5
            rounded-full
            border-2
            border-white
            border-t-transparent
            animate-spin
          "
        />
      ) : children ? (
        children
      ) : (
        <>
          {icon && (
            <span className="flex items-center text-lg">
              {icon}
            </span>
          )}

          {text}
        </>
      )}
    </button>
  );
};

export default PrimaryButton;