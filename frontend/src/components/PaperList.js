import React from "react";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
export default function PaperList() {

  let location = useLocation();
  let data = location.state.data;
  let navigate = useNavigate();
  let r = async (arxiv_id)=>{
    let rfd = await fetch('http://localhost:8000/similar',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "arxiv_id": arxiv_id,
          "top_k": 10,
          "fetch_metadata": true,
          "return_vector": false,
          "save_embeddings_only": false
        }
      )
    });
    let data = await rfd.json();
    let rfs = data.results;
    let plm = [];
    for(let j = 0;j<rfs.length;j++){
      let rf = rfs[j];
      let mtdata = rf.metadata;
      if(mtdata != null){
        let title = mtdata.title;
        let abstract = mtdata.abstract;
        let pl = {title:title,abstract:abstract};
        plm.push(pl);
      }

      navigate('/home',{
        state: {
          data: plm
        }
      });
      
    }

  

  } 
  
  
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
          <button key={idx} onClick={()=>r(item.arxiv_id)}>
            <div
            
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
            
          </div>
          </button>
        ))}
      </div>
    </div>
  );
} 