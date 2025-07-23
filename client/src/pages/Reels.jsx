import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const Reels = () => {
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/explore");
        const onlyReels = res.data
          .filter((post) => post.url.endsWith(".mp4"))
          .sort(() => 0.5 - Math.random()); // Shuffle
        setPosts(onlyReels);
      } catch (err) {
        console.error("Failed to fetch reels", err);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY > 20 && index < posts.length - 1) {
        setIndex((prev) => prev + 1);
      } else if (e.deltaY < -20 && index > 0) {
        setIndex((prev) => prev - 1);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" && index < posts.length - 1) {
        setIndex((prev) => prev + 1);
      } else if (e.key === "ArrowUp" && index > 0) {
        setIndex((prev) => prev - 1);
      }
    };
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, posts]);

  const current = posts[index];
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };
  const handleMouseDown = () => {
    const video = videoRef.current;
    if (video) video.pause();
  };
  const handleMouseUp = () => {
    const video = videoRef.current;
    if (video) video.play();
  };

  if (!current) return <div className="text-center mt-10">Loading reels...</div>;

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center select-none">
      <div className="relative aspect-[9/16] h-full max-h-full w-auto rounded-xl overflow-hidden shadow-xl">
        {/* Video */}
        <video
          ref={videoRef}
          src={current.url}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          onClick={handleVideoClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          controls={false}
          controlsList="nodownload"
          disablePictureInPicture
        />

        {/* Overlay content */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4 text-white bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          {/* Top: user info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
              {current.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold">{current.username || "Anonymous"}</div>
              <div className="text-sm text-gray-200">{current.email || "N/A"}</div>
            </div>
          </div>

          {/* Bottom: caption + actions */}
          <div className="flex justify-between items-end">
            <div className="max-w-[80%]">
              <div className="text-base font-semibold mb-1">{current.caption}</div>
              <div className="text-sm text-gray-200 line-clamp-3">{current.description}</div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Heart className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
              <MessageCircle className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
              <Share2 className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
