import {
  MdCheck,
  MdDelete,
  MdBlock,
} from "react-icons/md";

const DynamicConfirmationModal = ({
  open = false,

  title = "Confirm Action",
  description = "Are you sure you want to continue?",

  confirmLabel = "Confirm",
  cancelLabel = "Cancel",

  onConfirm,
  onCancel,

  icon,
  iconClassName,
  confirmClassName,

  // Optional input support
  showInput = false,
  inputLabel = "Reason",
  inputValue = "",
  inputPlaceholder = "Enter a reason...",
  onInputChange,
  inputRequired = false,
  inputType = "textarea",
}) => {
  if (!open) {
    return null;
  }

  /*
   * Determine the action from the title
   * and confirmation label when an icon
   * or button color is not explicitly supplied.
   */
  const actionText =
    `${title} ${confirmLabel}`.toLowerCase();

  const isApprove =
    actionText.includes("approve");

  const isInactive =
    actionText.includes("inactive");

  const isDanger =
    actionText.includes("reject") ||
    actionText.includes("remove") ||
    actionText.includes("delete") ||
    actionText.includes("cancel");

  /*
   * Explicitly supplied icon takes priority.
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
   * Explicitly supplied icon color takes priority.
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
   * Explicitly supplied confirmation button
   * color takes priority.
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

  const handleConfirm = () => {
    if (
      showInput &&
      inputRequired &&
      !inputValue.trim()
    ) {
      return;
    }

    onConfirm?.(inputValue);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onCancel?.();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="dynamic-confirmation-modal-title"
      >
        {/* Title */}

        <div className="flex items-center gap-2.5">
          {resolvedIcon && (
            <span
              className={`
                flex
                shrink-0
                items-center
                text-xl
                ${resolvedIconClassName}
              `}
            >
              {resolvedIcon}
            </span>
          )}

          <h3
            id="dynamic-confirmation-modal-title"
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            {title}
          </h3>
        </div>

        {/* Divider */}

        <div className="my-4 border-t border-gray-200" />

        {/* Description */}

        <p
          className="
            text-sm
            leading-6
            text-gray-500
          "
        >
          {description}
        </p>

        {/* Optional Input */}

        {showInput && (
          <div className="mt-5">
            <label
              htmlFor="dynamic-confirmation-input"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              {inputLabel}

              {inputRequired && (
                <span className="ml-1 text-red-500">
                  *
                </span>
              )}
            </label>

            {inputType === "input" ? (
              <input
                id="dynamic-confirmation-input"
                type="text"
                value={inputValue}
                onChange={(event) =>
                  onInputChange?.(
                    event.target.value
                  )
                }
                placeholder={
                  inputPlaceholder
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-green-500
                  focus:ring-1
                  focus:ring-green-500
                "
              />
            ) : (
              <textarea
                id="dynamic-confirmation-input"
                value={inputValue}
                onChange={(event) =>
                  onInputChange?.(
                    event.target.value
                  )
                }
                placeholder={
                  inputPlaceholder
                }
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-green-500
                  focus:ring-1
                  focus:ring-green-500
                "
              />
            )}
          </div>
        )}

        {/* Actions */}

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
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
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              showInput &&
              inputRequired &&
              !inputValue.trim()
            }
            className={`
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${resolvedConfirmClassName}
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicConfirmationModal;