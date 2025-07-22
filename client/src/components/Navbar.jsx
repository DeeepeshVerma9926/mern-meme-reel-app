import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  ImagePlus,
  Clapperboard,
  Smile,
} from 'lucide-react';

export const Navbar = ({ user, onProfileClick }) => {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { path: '/explore', label: 'Explore', icon: <Compass size={22} /> },
    { path: '/upload', label: 'Upload', icon: <ImagePlus size={22} /> },
    { path: '/reels', label: 'Reels', icon: <Clapperboard size={22} /> },
    { path: '/memes', label: 'Memes', icon: <Smile size={22} /> },
  ];

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`h-screen sticky top-0 flex flex-col justify-between bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        expanded ? 'w-56' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <img src="/image.png" alt="logo" className="w-12 h-12" />
        {expanded && <h1 className="text-xl font-bold text-blue-600">eMilo</h1>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {icon}
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Profile or Auth Buttons */}
      <div className="px-3 py-4 border-t">
        {user ? (
          <div
            onClick={onProfileClick}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {expanded && (
              <div className="text-sm">
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-gray-500 truncate w-32">{user.email}</p>
              </div>
            )}
          </div>
        ) : (
          expanded && (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/signup"
                className="text-sm bg-blue-600 text-white text-center py-1.5 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="text-sm border border-blue-600 text-blue-600 text-center py-1.5 rounded-md hover:bg-blue-100"
              >
                Log In
              </NavLink>
            </div>
          )
        )}
      </div>
    </div>
  );
};
