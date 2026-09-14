const SecondaryButton = ({
  children = "Cancel",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[100px]
        rounded-xl
        border
        border-gray-300
        px-5
        py-2.5
        text-sm
        font-semibold
        text-gray-700
        transition
        hover:bg-gray-50
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;