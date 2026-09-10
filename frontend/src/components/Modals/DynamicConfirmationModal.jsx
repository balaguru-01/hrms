import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

const DynamicConfirmationModal = ({
  open = false,

  title = "Confirm Action",
  description = "Are you sure you want to continue?",

  confirmLabel = "Confirm",
  cancelLabel = "Cancel",

  onConfirm,
  onCancel,
  icon,
  iconClassName = "text-gray-500",
  confirmClassName =
    "bg-green-600 hover:bg-green-700",

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

  const isConfirmDisabled =
    showInput &&
    inputRequired &&
    !inputValue.trim();

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
          {icon && (
            <span
              className={`
                flex
                shrink-0
                items-center
                text-xl
                ${iconClassName}
              `}
            >
              {icon}
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
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={false}
          >
            {cancelLabel}
          </SecondaryButton>

          <PrimaryButton
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            fullWidth={false}
            className={`px-4 py-2.5 text-sm ${confirmClassName}`}
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DynamicConfirmationModal;