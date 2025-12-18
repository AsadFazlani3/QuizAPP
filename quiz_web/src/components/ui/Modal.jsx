import { useEffect } from 'react';
import Button from './Button';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'primary'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {title && (
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
          )}
          <div className="mb-6">{children}</div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant={variant} onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

