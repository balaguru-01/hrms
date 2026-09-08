import {
  MdCheck,
  MdDelete,
  MdBlock,
} from "react-icons/md";

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  description = "Are you sure you want to continue?",
  message,

  confirmLabel = "Confirm",
  confirmText,

  cancelLabel = "Cancel",
  cancelText,

  onConfirm,
  onCancel,

  confirmClassName,
  icon,
  iconClassName,
}) => {
  if (!isOpen) {
    return null;
  }

  /*
   * Resolve older prop names without changing
   * the existing confirmation modal usage.
   */
  const resolvedDescription =
    message ?? description;

  const resolvedConfirmLabel =
    confirmText ?? confirmLabel;

  const resolvedCancelLabel =
    cancelText ?? cancelLabel;

  /*
   * Determine the action from the title/confirm
   * label when the parent does not explicitly
   * provide an icon or button color.
   */
  const actionText = `${title} ${resolvedConfirmLabel}`.toLowerCase();

  const isApprove =
    actionText.includes("approve");

  const isInactive =
    actionText.includes("inactive");

  const isDanger =
    actionText.includes("reject") ||
    actionText.includes("remove") ||
    actionText.includes("delete");

  /*
   * Restore the action-specific icons.
   *
   * Explicitly supplied icon still takes priority.
   */
  const resolvedIcon =
    icon ??
    (isApprove ? (
      <MdCheck />
    ) : isInactive ? (
      <MdBlock />
    ) : isDanger ? (
      <MdDelete />
    ) : null);

  /*
   * Restore the action-specific icon colors.
   *
   * Explicitly supplied iconClassName still
   * takes priority.
   */
  const resolvedIconClassName =
    iconClassName ??
    (isApprove
      ? "text-green-600"
      : isInactive
      ? "text-yellow-600"
      : isDanger
      ? "text-red-600"
      : "text-gray-500");

  /*
   * Restore the action-specific confirmation
   * button colors.
   *
   * Explicitly supplied confirmClassName still
   * takes priority.
   */
  const resolvedConfirmClassName =
    confirmClassName ??
    (isApprove
      ? "bg-green-600 hover:bg-green-700"
      : isInactive
      ? "bg-yellow-500 hover:bg-yellow-600"
      : isDanger
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onCancel?.();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        {/* Title */}

        <div className="flex items-center gap-2.5">
          {resolvedIcon && (
            <span
              className={`flex shrink-0 items-center text-xl ${resolvedIconClassName}`}
            >
              {resolvedIcon}
            </span>
          )}

          <h3
            id="confirmation-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
        </div>

        {/* Divider */}

        <div className="my-4 border-t border-gray-200" />

        {/* Description */}

        <p className="text-sm leading-6 text-gray-500">
          {resolvedDescription}
        </p>

        {/* Actions */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg
              border
              border-gray-300
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            {resolvedCancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              ${resolvedConfirmClassName}
            `}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;