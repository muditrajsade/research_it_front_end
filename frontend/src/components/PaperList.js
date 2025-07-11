import React from "react";

const data = [
  {
    title: "Deep Learning for Natural Language Processing",
    abstract: "This paper explores advanced deep learning architectures for NLP tasks, including transformers and attention mechanisms, and demonstrates their effectiveness on benchmark datasets.",
    summary: "This summary provides a concise overview of the key findings and implications of the research on deep learning in NLP.",
  },
  {
    title: "Quantum Computing: An Overview and Future Directions",
    abstract: "A comprehensive review of quantum computing principles, current hardware implementations, and the challenges that must be overcome for practical quantum advantage.",
    summary: "This summary highlights the main points regarding the current state and future prospects of quantum computing.",
  },
  {
    title: "Climate Change Impacts on Global Agriculture",
    abstract: "This study analyzes the projected effects of climate change on crop yields worldwide, using simulation models and historical data to forecast food security risks.",
    summary: "This summary discusses the anticipated impacts of climate change on agriculture and food security globally.",
  },
  {
    title: "Blockchain Technology in Financial Services",
    abstract: "An examination of how blockchain is transforming banking, payments, and asset management, with a focus on security, transparency, and regulatory considerations.",
    summary: "This summary outlines the transformative effects of blockchain technology in the financial sector.",
  },
  {
    title: "CRISPR and the Future of Gene Editing",
    abstract: "An in-depth look at CRISPR-Cas9 technology, its applications in medicine and agriculture, and the ethical debates surrounding human genome editing.",
    summary: "This summary reviews the advancements and ethical considerations of CRISPR gene editing.",
  },
  {
    title: "Autonomous Vehicles: Safety and Policy Challenges",
    abstract: "This paper reviews the current state of autonomous vehicle technology, accident statistics, and the evolving legal landscape for self-driving cars.",
    summary: "This summary covers the safety and policy issues related to autonomous vehicles.",
  },
  {
    title: "Renewable Energy Integration in Power Grids",
    abstract: "A technical analysis of integrating solar and wind energy into existing power grids, addressing intermittency, storage, and grid stability issues.",
    summary: "This summary explains the challenges and solutions for integrating renewable energy into power grids.",
  },
  {
    title: "The Psychology of Social Media Addiction",
    abstract: "Research findings on the behavioral and neurological factors contributing to social media addiction, and interventions for healthier digital habits.",
    summary: "This summary presents the main findings on social media addiction and possible interventions.",
  },
];

export default function PaperList() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 0",
        overflowY: "auto",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2.5rem", color: "#3730a3", textAlign: "center", width: "100%" }}>
        Research Papers
      </h2>
      <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "2.5rem 3rem",
              borderLeft: "7px solid #6366f1",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#4f46e5" }}>{item.title}</div>
            <div style={{ color: "#334155", fontSize: "1.15rem", fontStyle: "italic" }}>{item.abstract}</div>
            <div style={{ color: "#64748b", fontSize: "1.05rem" }}>{item.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 