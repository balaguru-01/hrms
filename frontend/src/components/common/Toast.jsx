import { useEffect } from "react";
import { MdError, MdClose } from "react-icons/md";

/*
 * Reusable toast notification component.
 *
 * Displays temporary error messages outside the
 * authentication card so the form layout remains stable.
 */
const Toast = ({ message = "", onClose, duration = 4000 }) => {
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

  return (
    <div className="fixed right-6 top-6 z-[9999] w-[380px] max-w-[calc(100vw-2rem)]">
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-xl">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <MdError className="text-xl text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            Login Failed
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