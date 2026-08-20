import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "error",
    title: "",
    duration: 4000,
  });

  const showToast = useCallback(
    ({
      message,
      type = "error",
      title,
      duration = 4000,
    }) => {
      setToast({
        message,
        type,
        title,
        duration,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast({
      message: "",
      type: "error",
      title: "",
      duration: 4000,
    });
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <Toast
        message={toast.message}
        type={toast.type}
        title={toast.title}
        duration={toast.duration}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
};

export default ToastContext;