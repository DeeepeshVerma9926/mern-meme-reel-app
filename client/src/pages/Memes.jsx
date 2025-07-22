// ✅ Full Memes page (image-only Explore clone)
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/explore");
        const imagesOnly = res.data.filter((item) => !item.url.includes(".mp4"));
        const shuffled = imagesOnly.sort(() => 0.5 - Math.random());
        setMemes(shuffled);
      } catch (err) {
        console.error("Failed to fetch memes", err);
      }
    };

    fetchMemes();
  }, []);

  useEffect(() => {
    const throttle = 600;
    const handleScroll = (e) => {
      const now = Date.now();
      if (now - lastScrollTime < throttle) return;

      if (e.deltaY > 0) {
        setIndex((prev) => (prev + 1) % memes.length);
      } else if (e.deltaY < 0) {
        setIndex((prev) => (prev - 1 + memes.length) % memes.length);
      }
      setLastScrollTime(now);
      setShowMore(false);
    };

    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        setIndex((prev) => (prev + 1) % memes.length);
        setShowMore(false);
      } else if (e.key === "ArrowUp") {
        setIndex((prev) => (prev - 1 + memes.length) % memes.length);
        setShowMore(false);
      }
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [memes, lastScrollTime]);

  if (!memes.length) return <div className="text-center mt-10">Loading memes...</div>;

  const current = memes[index];
  const next = memes[(index + 1) % memes.length];

  const preventDownload = (e) => e.preventDefault();

  const truncateDescription = (text, limit = 100) => {
    if (text.length <= limit) return text;
    return showMore ? text : text.slice(0, limit) + "...";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 gap-4 px-4 py-8 select-none">
      <div
        className="bg-white p-4 rounded-xl shadow-lg w-[400px] max-h-[90vh] overflow-hidden"
        onContextMenu={preventDownload}
      >
        <div className="font-semibold text-gray-800 mb-2">
          Uploader: {current.username || "Anonymous"} ({current.email || "hidden"})
        </div>

        <div className="aspect-[4/5] bg-black mb-2">
          <img
            src={current.url}
            alt={current.caption}
            className="w-full h-full object-cover rounded-md"
            onContextMenu={preventDownload}
            draggable={false}
          />
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

      {next && (
        <div
          className="w-[250px] h-[140px] bg-white rounded-lg shadow flex flex-col items-center overflow-hidden"
          onContextMenu={preventDownload}
        >
          <div className="text-xs text-gray-500 mt-2">⬇️ Next</div>
          <div className="flex-1 w-full">
            <img
              src={next.url}
              alt={next.caption}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Memes;
