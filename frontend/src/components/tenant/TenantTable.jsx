import {
  MdBusiness,
  MdVisibility,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";

const TenantTable = ({
  tenants,
  onView,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="text-gray-400 text-xs">↕</span>;
    }

    return sortDirection === "asc" ? (
      <MdArrowUpward className="text-gray-400 text-sm" />
    ) : (
      <MdArrowDownward className="text-gray-400 text-sm" />
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full min-w-[900px] border-collapse">
        {/* TABLE HEADER */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {/* ORGANIZATION */}
            <th className="px-3 py-5 text-left">
              <button
                type="button"
                onClick={() => handleSort("organization")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                Organization
                {getSortIcon("organization")}
              </button>
            </th>

            {/* CONTACT */}
            <th className="px-3 py-5 text-left text-sm font-semibold text-slate-800">
              Contact
            </th>

            {/* EMAIL */}
            <th className="px-3 py-5 text-left text-sm font-semibold text-slate-800">
              Email
            </th>

            {/* EMPLOYEES */}
            <th className="px-3 py-5 text-left">
              <button
                type="button"
                onClick={() => handleSort("employees")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                Employees
                {getSortIcon("employees")}
              </button>
            </th>

            {/* STATUS */}
            <th className="px-3 py-5 text-left text-sm font-semibold text-slate-800">
              Status
            </th>

            {/* CREATED */}
            <th className="px-3 py-5 text-left">
              <button
                type="button"
                onClick={() => handleSort("created")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                Created
                {getSortIcon("created")}
              </button>
            </th>

            {/* ACTIONS */}
            <th className="px-3 py-5 text-left text-sm font-semibold text-slate-800">
              Actions
            </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              {/* ORGANIZATION */}
              <td className="px-3 py-5">
                <div className="flex items-center gap-4">
                  {/* BUSINESS ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                    <MdBusiness className="text-2xl text-green-600" />
                  </div>

                  {/* ORGANIZATION NAME */}
                  <div className="w-[240px] shrink-0">
                    <p className="break-words text-base font-semibold text-slate-900">
                      {tenant.organization || "-"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tenant #{tenant.tenantId || tenant.id || "-"}
                    </p>
                  </div>

                  {/* VIEW / EYE */}
                  <button
                    type="button"
                    onClick={() => onView && onView(tenant)}
                    title="View tenant"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                  >
                    <MdVisibility className="text-xl" />
                  </button>
                </div>
              </td>

              {/* CONTACT */}
              <td className="px-3 py-5 text-sm text-slate-700">
                {tenant.contact && tenant.contact !== "-"
                  ? tenant.contact
                  : "-"}
              </td>

              {/* EMAIL */}
              <td className="px-3 py-5 text-sm text-slate-700">
                {tenant.email || "-"}
              </td>

              {/* EMPLOYEES */}
              <td className="px-3 py-5 text-sm text-slate-700">
                {Number(tenant.employees) || 0}
              </td>

              {/* STATUS */}
              <td className="px-3 py-5">
                <span
                  className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${
                    tenant.status === "Active"
                      ? "border border-green-200 bg-green-100 text-green-700"
                      : tenant.status === "Pending"
                      ? "border border-yellow-200 bg-yellow-100 text-yellow-700"
                      : "border border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {tenant.status || "Inactive"}
                </span>
              </td>

              {/* CREATED */}
              <td className="px-3 py-5 text-sm text-slate-700">
                {tenant.created || "-"}
              </td>

              {/* ACTIONS - DELETE ONLY */}
              <td className="px-3 py-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(tenant)}
                    title="Delete tenant"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantTable;