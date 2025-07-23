import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const Memes = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/explore");
        const imagePosts = res.data.filter(
          (post) =>
            post.url &&
            (post.url.endsWith(".jpg") ||
              post.url.endsWith(".jpeg") ||
              post.url.endsWith(".png"))
        );
        setMemes(imagePosts);
      } catch (err) {
        console.error("Error fetching memes:", err);
      }
    };

    fetchMemes();
  }, []);

  if (!memes.length) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading memes...</div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 py-8 min-h-screen gap-10">
      {memes.map((post, index) => {
        const username = post?.user?.username || "Unknown";
        const email = post?.user?.email || "N/A";
        const firstLetter = username[0]?.toUpperCase() || "?";

        return (
          <div
            key={index}
            className="w-full max-w-md bg-black rounded-2xl shadow-lg overflow-hidden relative"
          >
            {/* Meme Image */}
            <div className="aspect-[4/5] w-full h-full relative">
              <img
                src={post.url}
                alt={post.caption}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent text-white p-4 text-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
                    {firstLetter}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{username}</div>
                    <div className="text-xs text-gray-200">{email}</div>
                  </div>
                </div>

                <div className="mb-1">
                  <strong>Caption:</strong> {post.caption}
                </div>
                <div>
                  <strong>Description:</strong>{" "}
                  {post.description.length > 120 ? (
                    <span>
                      {post.description.slice(0, 120)}...
                      <button className="text-blue-300 text-xs ml-1">
                        See more
                      </button>
                    </span>
                  ) : (
                    post.description
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-4 top-1/3 flex flex-col gap-5 text-white">
              <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer" />
              <MessageCircle className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
              <Share2 className="w-6 h-6 hover:text-green-400 cursor-pointer" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Memes;
