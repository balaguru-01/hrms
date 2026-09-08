import { MdBusiness, MdClose } from "react-icons/md";

const ViewRequestModal = ({
  open,
  request,
  onClose,
}) => {
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

              <MdBusiness className="text-4xl text-green-700" />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Tenant Request
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review organization details before approval.
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

        <div className="grid grid-cols-2 gap-6 px-8 py-8">

          <div>
            <p className="text-sm text-gray-500">Organization</p>
            <h3 className="mt-1 font-semibold">
              {request.organization}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact Person</p>
            <h3 className="mt-1 font-semibold">
              {request.contact}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="mt-1 font-semibold">
              {request.email}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <h3 className="mt-1 font-semibold">
              {request.phone}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Requested On</p>
            <h3 className="mt-1 font-semibold">
              {request.requestedOn}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <h3 className="mt-1 font-semibold">
              {request.status}
            </h3>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-gray-200 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-6 py-3 font-medium hover:bg-gray-200"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default ViewRequestModal;