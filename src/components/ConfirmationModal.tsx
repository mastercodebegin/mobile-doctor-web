import React from 'react';
import { ShowModelCloseButtonClass, SubmitButtonClass } from '../helper/ApplicationConstants';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you want to proceed with this action?",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 border-2 border-black backdrop-blur-sm bg-white/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className={ShowModelCloseButtonClass}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={SubmitButtonClass}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
