import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { IoClose } from 'react-icons/io5';

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showConfirm?: boolean;
  onConfirm?: () => void;
  confirmLabel?: string;
  widthClass?: string; // p.ej. "max-w-md"
}

const PopUp: React.FC<PopUpProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showConfirm = false,
  onConfirm,
  confirmLabel = 'Aceptar',
  widthClass = 'max-w-md',
}) => {
  // bloquear scroll del body cuando esté abierto
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'popup'}
    >
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className={`relative z-10 w-full ${widthClass} mx-4`}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="p-1 rounded hover:bg-gray-100"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="p-4">
            {children}
          </div>

          {(showConfirm || onConfirm) && (
            <div className="px-4 py-3 border-t flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancelar
              </button>
              {showConfirm && (
                <button
                  onClick={() => { onConfirm && onConfirm(); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {confirmLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;

