// ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error";

interface Toast {
  message: string;
  id: number;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now(); // Unique ID for each toast
    setToasts((prev) => [...prev, { message, id, type }]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{ ...toastStyle, ...getToastStyle(toast.type) }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Inline styles for the toast container and individual toasts
const toastContainerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "20px",
  left: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 1000,
};

const toastStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "5px",
  color: "#fff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  animation: "fadein 0.3s",
};

// Function to get styles based on toast type
const getToastStyle = (type: ToastType): React.CSSProperties => {
  switch (type) {
    case "success":
      return { background: "#333" }; // Green for success
    case "error":
      return { background: "#f44336" }; // Red for error
    default:
      return {};
  }
};
