import RoleSelectionCard from "./RoleSelectionCard";

const RoleSelectionDropdown = ({
  isOpen,
  roles = [],
  loading = false,
  onRoleSelect,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      {loading && (
        <div className="flex items-center justify-center px-4 py-5">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />
        </div>
      )}

      {!loading && roles.length === 0 && (
        <div className="px-4 py-5 text-center">
          <p className="text-sm text-gray-500">
            No roles are currently available.
          </p>
        </div>
      )}

      {!loading && roles.length > 0 && (
        <div className="py-1">
          {roles.map((role) => (
            <RoleSelectionCard
              key={role._id}
              role={role}
              onSelect={onRoleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSelectionDropdown;