import React from 'react';
import { X } from 'lucide-react'; // ✅ You can use any close icon

const UserProfile = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-5 animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-700">Your Profile</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Username</p>
          <p className="text-lg font-medium">{user.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-lg font-medium">{user.phone || 'N/A'}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
