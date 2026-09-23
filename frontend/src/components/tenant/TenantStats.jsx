import {
  MdBusiness,
  MdCheckCircle,
  MdAccessTime,
  MdMailOutline,
} from "react-icons/md";

const TenantStats = ({
  tenants = [],
}) => {
  // ---------------------------------------
  // REMOVE DUPLICATE TENANT RECORDS
  // ---------------------------------------
  const uniqueTenants = Array.from(
    new Map(
      tenants.map((tenant, index) => {
        const email =
          tenant.email
            ?.trim()
            .toLowerCase();

        const tenantId =
          tenant.tenantId
            ?.toString()
            .trim();

        const organization =
          tenant.organization
            ?.trim()
            .toLowerCase();

        // Use the strongest available
        // unique identifier
        const uniqueKey =
          tenantId ||
          email ||
          organization ||
          `tenant-${index}`;

        return [
          uniqueKey,
          tenant,
        ];
      })
    ).values()
  );

  // ---------------------------------------
  // NORMALIZE STATUS
  // ---------------------------------------
  const getStatus = (tenant) =>
    tenant.status
      ?.toString()
      .trim()
      .toLowerCase();

  // ---------------------------------------
  // TOTAL TENANTS
  // ---------------------------------------
  const totalTenants =
    uniqueTenants.length;

  // ---------------------------------------
  // ACTIVE TENANTS
  // ---------------------------------------
  const activeTenants =
    uniqueTenants.filter(
      (tenant) =>
        getStatus(tenant) ===
        "active"
    ).length;

  // ---------------------------------------
  // PENDING TENANTS
  // ---------------------------------------
  const pendingTenants =
    uniqueTenants.filter(
      (tenant) =>
        getStatus(tenant) ===
          "pending" ||
        getStatus(tenant) ===
          "pending approval"
    ).length;

  // ---------------------------------------
  // INVITATIONS SENT
  // ---------------------------------------
  const invitationsSent =
    uniqueTenants.length;

  // ---------------------------------------
  // STATS
  // ---------------------------------------
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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