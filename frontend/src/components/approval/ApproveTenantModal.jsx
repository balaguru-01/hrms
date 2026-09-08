import { MdCheckCircle, MdClose } from "react-icons/md";

const ApproveTenantModal = ({
  open,
  tenant,
  onClose,
  onApprove,
}) => {
  if (!open || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Approve Tenant
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Confirm tenant approval before activating the organization.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <MdClose size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 px-8 py-8">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <MdCheckCircle className="text-3xl text-green-600" />

              <h3 className="text-lg font-semibold text-green-700">
                Tenant Details
              </h3>

            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500">Organization</p>
                <p className="font-semibold text-gray-900">
                  {tenant.organization}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-semibold text-gray-900">
                  {tenant.contact}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">
                  {tenant.email}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">
                  {tenant.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm leading-6 text-yellow-800">
              Approving this request will activate the tenant organization.
              A confirmation email will be sent automatically and the tenant
              will be able to log in after selecting their organization.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-100 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onApprove}
            className="rounded-2xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Approve Tenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTenantModal;