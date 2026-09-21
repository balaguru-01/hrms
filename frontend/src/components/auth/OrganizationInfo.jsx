const OrganizationInfo = ({
  organizationName = "Organization",
  organizationDomain = "",
}) => {
  return (
    <div className="text-center mb-5">

      <div
        className="
          h-16
          w-16
          mx-auto
          rounded-2xl
          bg-green-100
          border
          border-green-200
          flex
          items-center
          justify-center
          text-green-700
          text-3xl
          font-bold
          mb-3
        "
      >
        {organizationName.charAt(0)}
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {organizationName}
      </h2>

      <p className="mt-1 text-gray-500">
        Sign in to your account
      </p>

      {organizationDomain && (
        <p className="mt-1 text-sm text-gray-400">
          {organizationDomain}
        </p>
      )}

    </div>
  );
};

export default OrganizationInfo;