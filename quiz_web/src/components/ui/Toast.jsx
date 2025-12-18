import { useState, useEffect } from 'react';

let toastId = 0;
const toasts = [];
const listeners = [];

export const useToast = () => {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    const listener = () => {
      setToastList([...toasts]);
    };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const showToast = (message, type = 'info') => {
    const id = toastId++;
    const toast = { id, message, type };
    toasts.push(toast);
    listeners.forEach(l => l());
    
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.splice(index, 1);
        listeners.forEach(l => l());
      }
    }, 3000);
  };

  return { toasts: toastList, showToast };
};

function ToastContainer() {
  const { toasts } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const bgColor = {
          success: 'bg-green-500',
          error: 'bg-danger',
          info: 'bg-primary',
        }[toast.type] || 'bg-primary';

        return (
          <div
            key={toast.id}
            className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg min-w-[200px]`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;

