const PrimaryButton = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon = null,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className="
        w-full
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
      "
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
      ) : (
        icon && (
          <span className="flex items-center text-lg">
            {icon}
          </span>
        )
      )}

      {text}
    </button>
  );
};

export default PrimaryButton;