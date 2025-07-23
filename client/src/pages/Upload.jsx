import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Upload = () => {
  const [activeTab, setActiveTab] = useState('meme');
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const isImage = uploadedFile.type.startsWith('image/');
    const isVideo = uploadedFile.type.startsWith('video/');

    if (activeTab === 'meme' && !isImage) {
      setError('Only images are allowed for memes.');
      return;
    }
    if (activeTab === 'reel' && !isVideo) {
      setError('Only videos are allowed for reels.');
      return;
    }

    if (activeTab === 'meme' && uploadedFile.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    if (activeTab === 'reel' && uploadedFile.size > 500 * 1024 * 1024) {
      setError('Video must be under 500MB.');
      return;
    }

    if (activeTab === 'meme') {
      try {
        const options = {
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        };
        const compressed = await imageCompression(uploadedFile, options);
        setFile(compressed);
        setError('');
      } catch {
        setError('Image processing failed.');
      }
    } else if (activeTab === 'reel') {
      const videoURL = URL.createObjectURL(uploadedFile);
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        setTimeout(() => {
          const width = video.videoWidth;
          const height = video.videoHeight;
          const ratio = width / height;
          const expected = 9 / 16;
          const tolerance = 0.15;
          if (Math.abs(ratio - expected) > tolerance) {
            setError('Invalid video ratio – should be close to 9:16.');
          } else {
            setFile(uploadedFile);
            setError('');
          }
        }, 100);
      };

      video.onerror = () => setError('Failed to read video metadata.');
      video.src = videoURL;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || error) {
      setError(error || 'Please select a valid file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('description', description);
    formData.append('type', activeTab);

    const token = localStorage.getItem("token"); // ⬅️ Get JWT from localStorage

    try {
      setUploading(true);
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ⬅️ Add token in headers
        },
      });

      alert('Uploaded successfully!');
      setFile(null);
      setCaption('');
      setDescription('');
      setError('');
      navigate('/explore');
    } catch (err) {
      console.error(err);
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex mb-4 gap-4">
        <button
          onClick={() => {
            setActiveTab('meme');
            setFile(null);
            setError('');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'meme' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Meme
        </button>
        <button
          onClick={() => {
            setActiveTab('reel');
            setFile(null);
            setError('');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'reel' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Reel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept={activeTab === 'meme' ? 'image/*' : 'video/*'}
          onChange={handleFileChange}
          className="block w-full"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        ></textarea>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : `Upload ${activeTab === 'meme' ? 'Meme' : 'Reel'}`}
        </button>
      </form>
    </div>
  );
};
