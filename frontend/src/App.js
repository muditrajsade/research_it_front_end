import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Landing from './components/Landing';
import SearchPage from './components/SearchPage';
import PaperList from './components/PaperList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/papers" element={<PaperList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;