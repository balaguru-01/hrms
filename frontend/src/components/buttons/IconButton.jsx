const IconButton = ({
  icon: Icon,
  onClick,
  title,
  ariaLabel,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        p-2
        text-gray-500
        transition
        hover:bg-gray-100
        hover:text-gray-700
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export default IconButton;