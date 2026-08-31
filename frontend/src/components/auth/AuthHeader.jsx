const AuthHeader = ({
  icon,
  title,
  subtitle,
  className = "",
  iconWrapperClassName = "",
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div
      className={`mb-8 text-center ${className}`}
    >
      {icon && (
        <div
          className={`mb-5 flex justify-center ${iconWrapperClassName}`}
        >
          {icon}
        </div>
      )}

      <h1
        className={`text-4xl font-bold text-gray-900 ${titleClassName}`}
      >
        {title}
      </h1>

      <p
        className={`mt-3 text-base text-gray-500 ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;