// frontend/src/pages/Explore.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const videoRef = useRef(null);

  // Fetch and shuffle posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/explore");
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setPosts(shuffled);
      } catch (err) {
        console.error("Failed to fetch explore content", err);
      }
    };

    fetchPosts();
  }, []);

  // Scroll & Arrow navigation
  useEffect(() => {
    const scrollThrottle = 600; // ms

    const handleScroll = (e) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottle) return;

      if (e.deltaY > 0) {
        setIndex((prev) => (prev + 1) % posts.length);
      } else if (e.deltaY < 0) {
        setIndex((prev) => (prev - 1 + posts.length) % posts.length);
      }

      setLastScrollTime(now);
      setShowMore(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setIndex((prev) => (prev + 1) % posts.length);
        setShowMore(false);
      } else if (e.key === "ArrowUp") {
        setIndex((prev) => (prev - 1 + posts.length) % posts.length);
        setShowMore(false);
      }
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [posts, lastScrollTime]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [index]);

  if (!posts.length) return <div className="text-center mt-10">Loading...</div>;

  const current = posts[index];
  const next = posts[(index + 1) % posts.length];
  const isVideo = current.url.includes(".mp4");

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleMouseDown = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseUp = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const preventDownload = (e) => e.preventDefault();

  const truncateDescription = (text, limit = 100) => {
    if (text.length <= limit) return text;
    return showMore ? text : text.slice(0, limit) + "...";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 gap-4 px-4 py-8 select-none">
      {/* Main Post */}
      <div
        className="bg-white p-4 rounded-xl shadow-lg w-[400px] max-h-[90vh] overflow-hidden"
        onContextMenu={preventDownload}
      >
        <div className="font-semibold text-gray-800 mb-2">Uploader: Anonymous</div>

        <div className="aspect-[4/5] bg-black mb-2">
          {isVideo ? (
            <video
              src={current.url}
              ref={videoRef}
              className="w-full h-full object-cover rounded-md pointer-events-auto"
              muted
              autoPlay
              playsInline
              onClick={handleVideoClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onContextMenu={preventDownload}
              controls={false}
            />
          ) : (
            <img
              src={current.url}
              alt={current.caption}
              className="w-full h-full object-cover rounded-md"
              onContextMenu={preventDownload}
              draggable={false}
            />
          )}
        </div>

        <div className="text-sm text-gray-600 mb-1"><strong>Caption:</strong> {current.caption}</div>
        <div className="text-sm text-gray-500 mb-2">
          <strong>Description:</strong>{" "}
          {truncateDescription(current.description)}{" "}
          {current.description.length > 100 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-blue-500 text-xs underline ml-1"
            >
              {showMore ? "See less" : "See more"}
            </button>
          )}
        </div>

        <div className="flex justify-around text-gray-700 border-t pt-2">
          <button>❤️ Like</button>
          <button>💬 Comment</button>
          <button>📤 Share</button>
        </div>
      </div>

      {/* Next Post Preview */}
      {next && (
        <div
          className="w-[250px] h-[140px] bg-white rounded-lg shadow flex flex-col items-center overflow-hidden"
          onContextMenu={preventDownload}
        >
          <div className="text-xs text-gray-500 mt-2">⬇️ Next</div>
          <div className="flex-1 w-full">
            {next.url.includes(".mp4") ? (
              <video
                src={next.url}
                muted
                className="w-full h-full object-cover"
                playsInline
              />
            ) : (
              <img
                src={next.url}
                alt={next.caption}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
