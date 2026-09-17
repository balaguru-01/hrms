const OrganizationCard = ({
  organization,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        text-left
        transition
        duration-200

        ${
          selected
            ? "bg-green-50"
            : "hover:bg-gray-50"
        }
      `}
    >
      {/* Avatar */}

      <div
        className="
          h-9
          w-9
          rounded-md
          bg-slate-800
          text-white
          flex
          items-center
          justify-center
          font-semibold
          text-xs
          flex-shrink-0
        "
      >
        {organization.name
          .split(" ")
          .map(word => word[0])
          .join("")
          .substring(0, 2)}
      </div>

      {/* Details */}

      <div className="flex-1">

        <h3 className="text-sm font-semibold text-gray-900">
          {organization.name}
        </h3>

        <p className="text-xs text-gray-500">
          {organization.domain}
        </p>

      </div>

    </button>
  );
};

export default OrganizationCard;