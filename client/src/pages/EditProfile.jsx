// frontend/src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';

const dummyDPs = [
  '/cartoons/avatar1.png',
  '/cartoons/avatar2.png',
  '/cartoons/avatar3.png',
  '/cartoons/avatar4.png',
];

export const EditProfile = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [dp, setDp] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setUsername(res.data.username);
        setDp(res.data.dp || '');
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUploads = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/uploads', {
          headers: { Authorization: token },
        });
        setUploads(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchUploads();
  }, [token]);

  // ✅ Upload DP to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mern_uploads');

    setLoading(true);
    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dcdl72y33/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      setDp(data.secure_url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle profile update
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/user/update',
        { username, dp },
        { headers: { Authorization: token } }
      );
      alert('Profile updated!');
      setUser(res.data);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  // ✅ Delete post
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/upload/${postId}`, {
        headers: { Authorization: token },
      });
      setUploads((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Edit Profile</h2>

      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={dp || '/default-dp.png'}
            alt="dp"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h3 className="text-xl font-bold">{user.email}</h3>
            <p className="text-gray-500">Email (non-editable)</p>
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* DP Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Change DP</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>

        {/* Dummy DPs */}
        <div className="mb-4">
          <p className="text-sm mb-2 text-gray-700">Or choose from below:</p>
          <div className="flex gap-4">
            {dummyDPs.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="dummy"
                onClick={() => setDp(url)}
                className={`w-16 h-16 rounded-full cursor-pointer border ${
                  dp === url ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Save Changes'}
        </button>
      </div>

      {/* User Uploads */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Posts</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {uploads.map((post) => (
          <div key={post._id} className="relative group border rounded-md overflow-hidden">
            {post.type === 'image' ? (
              <img src={post.url} alt="upload" className="w-full object-cover aspect-[4/5]" />
            ) : (
              <video
                src={post.url}
                className="w-full object-cover aspect-[9/16]"
                controls
              />
            )}
            <button
              onClick={() => handleDelete(post._id)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
            >
              <Trash size={18} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
