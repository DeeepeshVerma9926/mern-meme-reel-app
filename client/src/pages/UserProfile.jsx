import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ user, onClose, onLogout }) => {
  const firstLetter = user?.username?.charAt(0)?.toUpperCase() || 'U';
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
    onClose(); // Close the drawer after navigating
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 p-6 animate-slide-in flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <X />
        </button>
      </div>

      {/* Avatar and Username */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-2 shadow">
          {firstLetter}
        </div>
        <p className="text-xl font-semibold text-gray-900">{user.username}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500">{user.phone || 'No phone number'}</p>
      </div>

      {/* Stats */}
      <div className="flex justify-around mt-6 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">120</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">450</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">380</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={handleEditProfile}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-medium transition"
        >
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
