const TenantStatusBadge = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Inactive":
        return "bg-red-100 text-red-700";

      case "Suspended":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses()}`}
    >
      {status}
    </span>
  );
};

export default TenantStatusBadge;