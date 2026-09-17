import { MdClose } from "react-icons/md";

const UserDetailsModal = ({
  open,
  user,
  onClose,
}) => {
  if (!open || !user) {
    return null;
  }

  const fullName =
    `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim();

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              User Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Review user's account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
              {user.firstName
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-gray-900">
                {fullName || "Unknown User"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {user.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Role
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.role || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Designation
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.designation || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Location
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.location || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                {user.status || "—"}
              </p>
            </div>

            {user.joinedAt && (
              <div>
                <p className="text-xs text-gray-400">
                  Joined At
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDateTime(
                    user.joinedAt
                  )}
                </p>
              </div>
            )}

            {user.registeredAt && (
              <div>
                <p className="text-xs text-gray-400">
                  Registered At
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDateTime(
                    user.registeredAt
                  )}
                </p>
              </div>
            )}

            {user.rejectionReason && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">
                  Reason for Rejection
                </p>

                <p className="mt-1 text-sm font-medium leading-5 text-gray-800">
                  {user.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;