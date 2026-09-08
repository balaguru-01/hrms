import {
  MdBusiness,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

import PendingTableHeader from "./PendingTableHeader";

const statusStyle = {
  Pending:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  Approved:
    "bg-green-100 text-green-700 border border-green-200",

  Rejected:
    "bg-red-100 text-red-700 border border-red-200",
};

const dummyRequests = [
  {
    id: 1,
    organization: "Acme Corporation",
    contact: "John David",
    email: "admin@acme.com",
    phone: "+91 9876543210",
    requestedOn: "12 Aug 2026",
    status: "Pending",
  },
  {
    id: 2,
    organization: "TechNova Pvt Ltd",
    contact: "Michael Roy",
    email: "contact@technova.com",
    phone: "+91 9845621458",
    requestedOn: "10 Aug 2026",
    status: "Pending",
  },
  {
    id: 3,
    organization: "GreenLeaf Solutions",
    contact: "Sara Wilson",
    email: "admin@greenleaf.com",
    phone: "+91 9784512365",
    requestedOn: "05 Aug 2026",
    status: "Pending",
  },
];

const PendingTable = ({
  requests = dummyRequests,
  sortField,
  sortDirection,
  onSort,
  onView,
  onApprove,
  onReject,
}) => {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Pending Tenant Requests
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Review and approve tenant registration requests.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <PendingTableHeader
                title="Organization"
                field="organization"
                sortable
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Contact
              </th>

              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Email
              </th>

              <PendingTableHeader
                title="Requested On"
                field="requestedOn"
                sortable
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="border-l border-gray-200 px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Quick Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-t border-gray-100 transition hover:bg-gray-50"
              >
                {/* Organization */}
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                      <MdBusiness className="text-2xl text-green-700" />
                    </div>

                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        {request.organization}
                      </p>

                      <p className="text-sm text-gray-500">
                        Request #{request.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="border-l border-gray-100 px-6 py-5 text-center text-gray-700">
                  {request.contact}
                </td>

                {/* Email */}
                <td className="border-l border-gray-100 px-6 py-5 text-center text-gray-600">
                  {request.email}
                </td>

                {/* Requested On */}
                <td className="border-l border-gray-100 px-6 py-5 text-center text-gray-600">
                  {request.requestedOn}
                </td>

                {/* Status */}
                <td className="border-l border-gray-100 px-6 py-5 text-center">
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${statusStyle[request.status]}`}
                  >
                    {request.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="border-l border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onView?.(request)
                      }
                      title="View Request"
                      aria-label="View Request"
                      className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                    >
                      <MdVisibility size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onApprove?.(request)
                      }
                      title="Approve Request"
                      aria-label="Approve Request"
                      className="rounded-xl bg-green-50 p-2 text-green-600 transition hover:bg-green-100"
                    >
                      <MdCheckCircle size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onReject?.(request)
                      }
                      title="Reject Request"
                      aria-label="Reject Request"
                      className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    >
                      <MdCancel size={20} />
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

export default PendingTable;