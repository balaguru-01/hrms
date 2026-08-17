const AuthCard = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-[700px] rounded-3xl border border-gray-100 bg-white px-10 py-5 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

export default AuthCard;