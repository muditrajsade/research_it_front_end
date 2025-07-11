import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

const data = [
  {
    title: "Welcome to My Site",
    abstract: "This is a long abstract for Welcome explaining the site in detail. It elaborates the features, goals, and target audience.",
    summary: "A short overview of what the site does and why it matters.",
  },
  {
    title: "Explore the Features",
    abstract: "Abstract about features in depth with technical breakdown.",
    summary: "Key functionalities and what makes them unique.",
  },
  {
    title: "Meet the Team",
    abstract: "Learn more about the people behind the product and their experience.",
    summary: "Overview of team members, skills, and culture.",
  },
  {
    title: "Read Our Blog",
    abstract: "Discover updates, tips, and deep dives in our regular blog posts.",
    summary: "Highlights of our blog content and strategy.",
  },
  {
    title: "Contact Us",
    abstract: "Ways to reach us for support, feedback, or collaboration.",
    summary: "Our contact methods and expected response times.",
  },
];

const variants = {
  enter: (direction) => ({
    y: direction > 0 ? 200 : -200, // vertical slide
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction > 0 ? -200 : 200, // vertical slide
    opacity: 0,
  }),
};


export default function FullscreenCarousel() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const scrolling = useRef(false); // throttle flag
  const containerRef = useRef(null);

  const SCROLL_THRESHOLD = 50; // Only trigger if deltaY is large enough

  const paginate = (newDirection) => {
    setIndex(([current]) => {
      let next = current + newDirection;
      if (next < 0) next = 0;
      else if (next >= data.length) next = data.length - 1;
      return [next, newDirection];
    });
  };

  // Improved scroll handler: throttle so only one card per gesture, and only on large deltaY
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
      if (e.deltaY > 0 && index < data.length - 1) {
        paginate(1);
        scrolling.current = true;
        setTimeout(() => { scrolling.current = false; }, 700); // match animation
      } else if (e.deltaY < 0 && index > 0) {
        paginate(-1);
        scrolling.current = true;
        setTimeout(() => { scrolling.current = false; }, 700);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [index]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, #e0f2ff, #dbeafe, #eef2ff)",
        position: "relative",
        fontFamily: "system-ui, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Top bar with RESEARCHIT and SearchBar */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          padding: "0 2rem",
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "#7c3aed",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          RESEARCHIT
        </div>
        <div style={{ flex: 1, maxWidth: "600px" }}>
          <SearchBar onSearch={() => {}} />
        </div>
      </div>
      {/* Card content */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6 }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            padding: "6rem 5vw 5vw", // top padding to account for top bar
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2.5rem",
            background: "white",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(80, 80, 160, 0.10)",
          }}
        >
          {/* Left column: title only, vertically centered */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              minWidth: 0,
              paddingTop: "14vh", // Nudge title above center, easy to tweak
            }}
          >
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#3730a3",
                textAlign: "center",
                margin: 0,
              }}
            >
              {data[index].title}
            </h1>
          </div>
          {/* Right column: abstract (nudged down) + summary stacked */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              minWidth: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "#eef2ff",
                borderLeft: "6px solid #6366f1",
                borderRadius: 10,
                padding: "1.5rem 1.25rem",
                maxHeight: "40vh",
                minWidth: 0,
                width: "100%",
                boxShadow: "0 2px 8px rgba(80,80,160,0.06)",
                fontStyle: "italic",
                color: "#4f46e5",
                fontSize: "1.125rem",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                marginTop: "18vh", // Nudge abstract down to just above center
                transition: "margin-top 0.3s",
              }}
            >
              <strong>Abstract:</strong>
              <p style={{ marginTop: 10 }}>{data[index].abstract}</p>
            </div>
            <div
              style={{
                color: "#334155",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                maxHeight: "25vh",
                overflowY: "auto",
                background: "#f8fafc",
                borderRadius: 10,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 8px rgba(80,80,160,0.04)",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <strong style={{ color: "#4338ca" }}>Summary:</strong>
              <p style={{ marginTop: 10 }}>{data[index].summary}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Navigation arrows (vertical, right side) */}
      <div style={{
        position: "absolute",
        right: "2%",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        zIndex: 20,
      }}>
        {index > 0 && (
          <button
            onClick={() => paginate(-1)}
            style={{
              fontSize: "2.5rem",
              background: "none",
              border: "none",
              color: "#4b5563",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Previous"
          >
            &#8593;
          </button>
        )}
        {index < data.length - 1 && (
          <button
            onClick={() => paginate(1)}
            style={{
              fontSize: "2.5rem",
              background: "none",
              border: "none",
              color: "#4b5563",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Next"
          >
            &#8595;
          </button>
        )}
      </div>
    </div>
  );
}
