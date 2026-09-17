import {
  MdVisibility,
  MdEdit,
  MdDelete,
  MdBusiness,
} from "react-icons/md";

import TenantTableHeader from "./TenantTableHeader";

const dummyTenants = [
  {
    id: 1,
    organization: "Acme Corporation",
    contact: "John David",
    email: "admin@acme.com",
    employees: 156,
    status: "Active",
    created: "12 Aug 2026",
  },
  {
    id: 2,
    organization: "TechNova Pvt Ltd",
    contact: "Michael Roy",
    email: "contact@technova.com",
    employees: 82,
    status: "Pending",
    created: "10 Aug 2026",
  },
  {
    id: 3,
    organization: "GreenLeaf Solutions",
    contact: "Sara Wilson",
    email: "admin@greenleaf.com",
    employees: 245,
    status: "Active",
    created: "05 Aug 2026",
  },
];

const statusStyle = {
  Active:
    "bg-green-100 text-green-700 border border-green-200",
  Pending:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Inactive:
    "bg-red-100 text-red-700 border border-red-200",
};

const TenantTable = ({
  tenants = dummyTenants,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

        <div>

          <h2 className="text-xl font-semibold text-gray-900">
            Tenant Organizations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage all organizations connected with TenantHub.
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <TenantTableHeader
                title="Organization"
                field="organization"
                sortable
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Email
              </th>

              <TenantTableHeader
                title="Employees"
                field="employees"
                sortable
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Status
              </th>

              <TenantTableHeader
                title="Created"
                field="created"
                sortable
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tenants.map((tenant) => (

              <tr
                key={tenant.id}
                onClick={() => onView?.(tenant)}
                className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">

                      <MdBusiness className="text-2xl text-green-700" />

                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {tenant.organization}
                      </p>

                      <p className="text-sm text-gray-500">
                        Tenant #{tenant.id}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5 text-gray-700">
                  {tenant.contact}
                </td>

                <td className="px-6 py-5 text-gray-600">
                  {tenant.email}
                </td>

                <td className="px-6 py-5 text-center font-medium text-gray-700">
                  {tenant.employees}
                </td>

                <td className="px-6 py-5 text-center">

                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${statusStyle[tenant.status]}`}
                  >
                    {tenant.status}
                  </span>

                </td>

                <td className="px-6 py-5 text-center text-gray-600">
                  {tenant.created}
                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center justify-center gap-3">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(tenant);
                      }}
                      className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                    >
                      <MdVisibility size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(tenant);
                      }}
                      className="rounded-xl bg-yellow-50 p-2 text-yellow-600 transition hover:bg-yellow-100"
                    >
                      <MdEdit size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(tenant);
                      }}
                      className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    >
                      <MdDelete size={20} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TenantTable;