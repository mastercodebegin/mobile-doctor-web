// components/CreateUserModal.tsx
import React from 'react';
import CreateUserForm from './CreateUserForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateUserModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">Create New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">✕</button>
        </div>
        <div className="p-4">
          <CreateUserForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;