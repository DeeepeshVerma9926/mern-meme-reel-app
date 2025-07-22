import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Explore from './pages/Explore.jsx';
import { Upload } from './pages/Upload.jsx';
import { Reels } from './pages/Reels.jsx';
import  Memes  from './pages/Memes.jsx';
import UserProfile from './pages/UserProfile.jsx';

export const App = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOpenProfile(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar/Navbar shown always */}
      <Navbar
        user={user}
        onProfileClick={() => setOpenProfile(true)}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto relative">
        <Routes>
          {/* Redirect root to /signup */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <Reels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memes"
            element={
              <ProtectedRoute>
                <Memes />
              </ProtectedRoute>
            }
          />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
        </Routes>

        {/* Slide-in Profile Drawer */}
        {openProfile && user && (
          <UserProfile
            user={user}
            onClose={() => setOpenProfile(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};
