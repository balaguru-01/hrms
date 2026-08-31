const AuthCard = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-[560px] rounded-2xl border border-gray-100 bg-white px-6 py-6 shadow-2xl sm:max-w-[600px] sm:rounded-3xl sm:px-8 sm:py-7 lg:px-10 lg:py-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default AuthCard;