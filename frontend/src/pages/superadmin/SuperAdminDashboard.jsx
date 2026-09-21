import DashboardLayout from "../../components/layout/DashboardLayout";

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      subtitle="Monitor and manage the TenantHub platform."
    >
      <div className="space-y-8">

        {/* ==================================================
            STATS
            ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Organizations
            </p>

            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              24
            </h3>

            <p className="mt-2 text-sm text-green-600">
              +4 this month
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending Approvals
            </p>

            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              8
            </h3>

            <p className="mt-2 text-sm text-yellow-600">
              Requires attention
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Users
            </p>

            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              1,248
            </h3>

            <p className="mt-2 text-sm text-green-600">
              +12.5% growth
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Organizations
            </p>

            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              21
            </h3>

            <p className="mt-2 text-sm text-green-600">
              87.5% active
            </p>
          </div>

        </div>

        {/* ==================================================
            MAIN CONTENT
            ================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Organization Overview */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Organization Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current platform organization statistics.
                </p>
              </div>

            </div>

            <div className="mt-8 space-y-6">

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Active
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    21
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[88%] rounded-full bg-green-600" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Pending
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    8
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[34%] rounded-full bg-yellow-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Inactive
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    3
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[13%] rounded-full bg-red-500" />
                </div>
              </div>

            </div>

          </div>

          {/* Recent Activity */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest platform activities.
            </p>

            <div className="mt-6 space-y-5">

              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm font-medium text-gray-800">
                  New organization registered
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Acme Corporation
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  10 minutes ago
                </p>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm font-medium text-gray-800">
                  Tenant approval requested
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  TechNova Pvt Ltd
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  35 minutes ago
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Organization activated
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  GreenLeaf Solutions
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  1 hour ago
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            PENDING REQUESTS
            ================================================== */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Tenant Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tenant registrations waiting for review.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              View All
            </button>

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="min-w-full">

              <thead>
                <tr className="border-b border-gray-100">

                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                    Organization
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                    Contact
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600">
                    Requested
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                <tr className="border-b border-gray-100">

                  <td className="px-4 py-5">
                    <p className="font-semibold text-gray-900">
                      Acme Corporation
                    </p>

                    <p className="text-xs text-gray-500">
                      Tenant #104
                    </p>
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    John David
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    Today
                  </td>

                  <td className="px-4 py-5 text-center">

                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>

                  </td>

                </tr>

                <tr className="border-b border-gray-100">

                  <td className="px-4 py-5">
                    <p className="font-semibold text-gray-900">
                      TechNova Pvt Ltd
                    </p>

                    <p className="text-xs text-gray-500">
                      Tenant #103
                    </p>
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    Michael Roy
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    Yesterday
                  </td>

                  <td className="px-4 py-5 text-center">

                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>

                  </td>

                </tr>

                <tr>

                  <td className="px-4 py-5">
                    <p className="font-semibold text-gray-900">
                      GreenLeaf Solutions
                    </p>

                    <p className="text-xs text-gray-500">
                      Tenant #102
                    </p>
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    Sara Wilson
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    2 days ago
                  </td>

                  <td className="px-4 py-5 text-center">

                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;