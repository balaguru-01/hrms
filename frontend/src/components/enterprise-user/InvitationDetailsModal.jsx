import { MdClose } from "react-icons/md";

const InvitationDetailsModal = ({
  open,
  invitation,
  onClose,
}) => {
  if (!open || !invitation) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Invitation Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Email */}
            <div>
              <p className="text-xs text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {invitation.email || "—"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                {invitation.status || "—"}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-xs text-gray-400">
                Role
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {invitation.role || "—"}
              </p>
            </div>

            {/* Designation */}
            <div>
              <p className="text-xs text-gray-400">
                Designation
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {invitation.designation || "—"}
              </p>
            </div>

            {/* Invited At */}
            <div>
              <p className="text-xs text-gray-400">
                Invited At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {invitation.invitedAt || "—"}
              </p>
            </div>

            {/* Expires At */}
            <div>
              <p className="text-xs text-gray-400">
                Expires At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {invitation.expiresAt || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDetailsModal;