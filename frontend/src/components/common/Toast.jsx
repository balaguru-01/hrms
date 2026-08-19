import { useEffect } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdError,
  MdWarning,
} from "react-icons/md";

const TOAST_TYPES = {
  success: {
    icon: MdCheckCircle,
    title: "Success",
    iconClassName: "text-green-600",
    iconBackgroundClassName: "bg-green-100",
    borderClassName: "border-green-200",
  },
  error: {
    icon: MdError,
    title: "Error",
    iconClassName: "text-red-600",
    iconBackgroundClassName: "bg-red-100",
    borderClassName: "border-red-200",
  },
  warning: {
    icon: MdWarning,
    title: "Warning",
    iconClassName: "text-yellow-600",
    iconBackgroundClassName: "bg-yellow-100",
    borderClassName: "border-yellow-200",
  },
};

const Toast = ({
  message = "",
  type = "error",
  title,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, onClose, duration]);

  if (!message) {
    return null;
  }

  const toastConfig =
    TOAST_TYPES[type] || TOAST_TYPES.error;

  const Icon = toastConfig.icon;

  return (
    <div className="fixed right-6 top-6 z-[9999] w-[380px] max-w-[calc(100vw-2rem)]">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${toastConfig.borderClassName}`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toastConfig.iconBackgroundClassName}`}
        >
          <Icon
            className={`text-xl ${toastConfig.iconClassName}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {title || toastConfig.title}
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-600">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="shrink-0 text-gray-400 transition hover:text-gray-700"
        >
          <MdClose className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Toast;