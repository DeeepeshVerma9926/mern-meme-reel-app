import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export const Reels = () => {
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

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleMouseDown = () => {
    const video = videoRef.current;
    if (video) video.pause();
  };

  const handleMouseUp = () => {
    const video = videoRef.current;
    if (video) video.play();
  };

  if (!posts.length) return <div className="text-center mt-10">Loading...</div>;

  const current = posts[index];
  const next = posts[(index + 1) % posts.length];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 gap-4 px-4 py-8 select-none">
      {/* Main Post */}
      <div className="bg-white p-4 rounded-xl shadow-lg w-[400px] max-h-[90vh] overflow-hidden">
        <div className="font-semibold text-gray-800 mb-2">
          Uploader: {current?.user?.username || "Unknown"} ({current?.user?.email || "N/A"})
        </div>

        <div className="aspect-[9/16] bg-black mb-2 relative">
          <video
            ref={videoRef}
            src={current.url}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover rounded-md pointer-events-auto"
            onClick={handleVideoClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            controls={false}
            controlsList="nodownload"
            disablePictureInPicture
          />
        </div>

        <div className="text-sm text-gray-600 mb-1">
          <strong>Caption:</strong> {current.caption}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          <strong>Description:</strong>{" "}
          {current.description.length > 120 ? (
            <span>
              {current.description.slice(0, 120)}...
              <button className="text-blue-600 text-xs ml-1">See more</button>
            </span>
          ) : (
            current.description
          )}
        </div>

        <div className="flex justify-around text-gray-700 border-t pt-2">
          <button>❤️ Like</button>
          <button>💬 Comment</button>
          <button>📤 Share</button>
        </div>
      </div>

      {/* Next Reel Preview */}
      {next && (
        <div className="w-[250px] h-[140px] bg-white rounded-lg shadow flex flex-col items-center overflow-hidden">
          <div className="text-xs text-gray-500 mt-2">⬇️ Next</div>
          <div className="flex-1 w-full">
            <video src={next.url} muted className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
