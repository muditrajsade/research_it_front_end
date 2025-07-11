import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Router,Routes, Route} from 'react-router-dom';
import Home from './components/home';
import Index from './components/Landing';
import PaperList from './components/PaperList';
function App() {
  return (
    <div>
      <Routes>
      <Route path='/' element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/paperlist" element={<PaperList />} />
    </Routes>
    

    

  </div>
  );
}

export default App;
