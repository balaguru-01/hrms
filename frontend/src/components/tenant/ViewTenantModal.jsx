import {
  MdClose,
  MdBusiness,
  MdPeople,
  MdEmail,
  MdPhone,
  MdCalendarToday,
} from "react-icons/md";

const statusStyle = {
  Active:
    "bg-green-100 text-green-700 border border-green-200",

  Pending:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  Inactive:
    "bg-red-100 text-red-700 border border-red-200",
};

const InfoRow = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {value !== undefined &&
          value !== null &&
          value !== ""
            ? value
            : "-"}
        </p>
      </div>
    </div>
  );
};

const ViewTenantModal = ({
  open,
  tenant,
  onClose,
}) => {
  if (!open || !tenant) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <MdBusiness className="text-4xl text-green-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tenant.organization}
              </h2>

              <span
                className={`mt-2 inline-block rounded-full px-4 py-1 text-xs font-semibold ${
                  statusStyle[tenant.status] ||
                  statusStyle.Pending
                }`}
              >
                {tenant.status}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">

          {/* Contact Person */}
          <InfoRow
            icon={<MdPeople size={24} />}
            label="Contact Person"
            value={tenant.contact}
          />

          {/* Email */}
          <InfoRow
            icon={<MdEmail size={24} />}
            label="Email Address"
            value={tenant.email}
          />

          {/* Phone */}
          <InfoRow
            icon={<MdPhone size={24} />}
            label="Phone Number"
            value={tenant.phone}
          />

          {/* Employees */}
          <InfoRow
            icon={<MdPeople size={24} />}
            label="Employees"
            value={tenant.employees}
          />

          {/* Created Date */}
          <InfoRow
            icon={<MdCalendarToday size={22} />}
            label="Created On"
            value={tenant.created}
          />

          {/* Dynamic Tenant ID */}
          <InfoRow
            icon={<MdBusiness size={22} />}
            label="Tenant ID"
            value={
              tenant.tenantId ||
              `TEN-${tenant.id}`
            }
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-8 py-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTenantModal;