import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/home';
import SearchPage from './components/SearchPage';
import PaperList from './components/PaperList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/papers" element={<PaperList />} />
      </Routes>
    </div>
  );
}

export default App;
