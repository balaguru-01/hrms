const AuthHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      {icon && <div className="mb-5 flex justify-center">{icon}</div>}

      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>

      <p className="mt-3 text-base text-gray-500">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;