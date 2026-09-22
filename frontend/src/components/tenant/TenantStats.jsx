import {
  MdBusiness,
  MdCheckCircle,
  MdAccessTime,
  MdMailOutline,
} from "react-icons/md";

const TenantStats = ({
  tenants = [],
}) => {
  // Total tenants
  const totalTenants =
    tenants.length;

  // Active tenants
  const activeTenants =
    tenants.filter(
      (tenant) =>
        tenant.status === "Active"
    ).length;

  // Pending tenants
  const pendingTenants =
    tenants.filter(
      (tenant) =>
        tenant.status === "Pending"
    ).length;

  // Invitations sent
  // Every tenant currently represents
  // an invitation/tenant record.
  const invitationsSent =
    tenants.length;

  const stats = [
    {
      title: "Total Tenants",
      value: totalTenants,
      icon: (
        <MdBusiness className="text-3xl text-blue-600" />
      ),
      iconBg: "bg-blue-100",
    },

    {
      title: "Active Tenants",
      value: activeTenants,
      icon: (
        <MdCheckCircle className="text-3xl text-green-600" />
      ),
      iconBg: "bg-green-100",
    },

    {
      title: "Pending Approval",
      value: pendingTenants,
      icon: (
        <MdAccessTime className="text-3xl text-yellow-600" />
      ),
      iconBg: "bg-yellow-100",
    },

    {
      title: "Invitations Sent",
      value: invitationsSent,
      icon: (
        <MdMailOutline className="text-3xl text-purple-600" />
      ),
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}

    </div>
  );
};

export default TenantStats;