// src/pages/Dashboard.jsx
import React from 'react';

const Explore = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="bg-white text-black p-10 rounded-2xl shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username || 'User'} 👋</h1>
        <p className="text-lg">This is a protected Explore page.</p>
      </div>
    </div>
  );
};

export default Explore;
