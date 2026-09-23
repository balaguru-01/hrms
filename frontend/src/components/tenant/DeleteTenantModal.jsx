import { MdClose, MdDeleteForever } from "react-icons/md";

const DeleteTenantModal = ({
  open,
  tenant,
  onClose,
  onConfirm,
}) => {
  if (!open || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
              <MdDeleteForever className="text-3xl text-red-600" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Delete Tenant
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          >
            <MdClose size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="px-8 py-8">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="text-gray-700 leading-7">
              Are you sure you want to permanently delete
              <span className="font-bold text-red-600">
                {" "}
                {tenant.organization}
              </span>
              ?
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Deleting this tenant will remove its organization,
              users, departments, attendance records and related
              data after backend confirmation.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-200 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm?.(tenant)}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Delete Tenant
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteTenantModal;