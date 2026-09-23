import OrganizationCard from "./OrganizationCard";

const OrganizationDropdown = ({
  show,
  organizations,
  selectedOrganization,
  onSelect,
}) => {
  if (!show) return null;

  return (
   <div
      className="
        absolute
        left-0
        top-full
        mt-2
        w-[52%]
        max-w-[340px]
        min-w-[300px]
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-xl
        z-50
        overflow-hidden
      "
    >
      {organizations.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">

          {organizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              selected={selectedOrganization?.id === organization.id}
              onClick={() => onSelect(organization)}
            />
          ))}

        </div>
      ) : (
        <div className="px-5 py-6 text-center text-gray-500">
          No organizations available.
        </div>
      )}
    </div>
  );
};

export default OrganizationDropdown;