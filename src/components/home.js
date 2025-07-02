import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";

const data = [
  {
    title: "Welcome to My Site",
    abstract: "This is an abstract for Welcome.",
    summary: "Summary for Welcome."
  },
  {
    title: "Explore the Features",
    abstract: "Abstract about features.",
    summary: "Summary of features."
  },
  {
    title: "Meet the Team",
    abstract: "Abstract about team.",
    summary: "Summary about team."
  },
  {
    title: "Read Our Blog",
    abstract: "Abstract about blog.",
    summary: "Summary about blog."
  },
  {
    title: "Contact Us",
    abstract: "Abstract about contact.",
    summary: "Summary about contact."
  }
];

function Home() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect which title is mostly visible in center box
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children);
      const containerTop = container.getBoundingClientRect().top;

      // Find index of child whose top is closest to container top (>= 0)
      let closestIndex = 0;
      let closestDistance = Infinity;
      children.forEach((child, i) => {
        const childTop = child.getBoundingClientRect().top;
        const distance = Math.abs(childTop - containerTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setCurrentIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);

    // Initialize once
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="outer-container">
      <motion.div className="side-box left-box" key={"abstract-" + currentIndex}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Abstract</h3>
        <p>{data[currentIndex].abstract}</p>
      </motion.div>

      <div className="scroll-container" ref={scrollRef}>
        {data.map(({ title }, index) => (
          <motion.div
            key={index}
            className="title-slide"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.8 }}
          >
            <h2>{title}</h2>
          </motion.div>
        ))}
      </div>

      <motion.div className="side-box right-box" key={"summary-" + currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Summary</h3>
        <p>{data[currentIndex].summary}</p>
      </motion.div>
    </div>
  );
}

export default Home;
