import { MdClose, MdOutlineCancel } from "react-icons/md";

const RejectTenantModal = ({
  open,
  tenant,
  reason,
  onReasonChange,
  onReject,
  onClose,
}) => {
  if (!open || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">

              <MdOutlineCancel className="text-3xl text-red-600" />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Reject Request
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Send a rejection message to the tenant.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-gray-100"
          >
            <MdClose size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 px-8 py-8">

          <div>

            <p className="text-sm text-gray-500">
              Organization
            </p>

            <h3 className="mt-1 text-lg font-semibold text-gray-900">
              {tenant.organization}
            </h3>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rejection Reason
            </label>

            <textarea
              rows={5}
              value={reason}
              onChange={onReasonChange}
              placeholder="Enter the reason for rejection..."
              className="
                w-full
                rounded-2xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition

                focus:border-red-500
                focus:ring-4
                focus:ring-red-100
              "
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-200 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onReject}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Reject Tenant
          </button>

        </div>

      </div>

    </div>
  );
};

export default RejectTenantModal;