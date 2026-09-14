import { MdClose } from "react-icons/md";

const DynamicDetailsModal = ({
  open,
  title = "Details",
  subtitle,
  data,
  fields = [],
  avatar,
  onClose,
}) => {
  if (!open || !data) {
    return null;
  }

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

  const getValue = (field) => {
    if (typeof field.getValue === "function") {
      return field.getValue(data);
    }

    const value = data?.[field.key];

    if (field.type === "date") {
      return formatDateTime(value);
    }

    if (value === null || value === undefined || value === "") {
      return field.emptyValue ?? "—";
    }

    return value;
  };

  const fullName =
    data?.fullName ||
    `${data?.firstName || ""} ${data?.lastName || ""}`.trim();

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
        py-6
        backdrop-blur-[1px]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="dynamic-details-modal-title"
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-5
            py-4
            sm:px-6
          "
        >
          <div>
            <h2
              id="dynamic-details-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
            aria-label="Close"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}

        <div className="space-y-5 px-5 py-5 sm:px-6">
          {/* Optional Avatar */}

          {avatar && (
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-green-100
                  text-xl
                  font-bold
                  text-green-700
                "
              >
                {avatar}
              </div>

              {fullName && (
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-gray-900">
                    {fullName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Details */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const value = getValue(field);

              if (
                typeof field.show === "function" &&
                !field.show(data)
              ) {
                return null;
              }

              return (
                <div
                  key={field.key}
                  className={
                    field.fullWidth
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <p className="text-xs text-gray-400">
                    {field.label}
                  </p>

                  <p
                    className={`
                      mt-1
                      text-sm
                      font-medium
                      text-gray-800
                      ${
                        field.breakAll
                          ? "break-all"
                          : ""
                      }
                      ${
                        field.capitalize
                          ? "capitalize"
                          : ""
                      }
                      ${field.className || ""}
                    `}
                  >
                    {typeof field.render === "function"
                      ? field.render(value, data)
                      : value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicDetailsModal;