const formatRoleName = (roleName = "") => {
  return roleName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) =>
      character.toUpperCase()
    );
};

const RoleSelectionCard = ({
  role,
  onSelect,
}) => {
  const displayName = formatRoleName(
    role?.name
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-green-50 hover:text-green-700 focus:outline-none focus:bg-green-50"
    >
      {displayName}
    </button>
  );
};

export default RoleSelectionCard;