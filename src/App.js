import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Router,Routes, Route} from 'react-router-dom';
import Home from './components/home';
import Index from './components/Landing';

function App() {
  return (
    <div>

   
      <Routes>
      <Route path='/' element={<Index />} />
      <Route path="/home" element={<Home />} />
    </Routes>
    

    

  </div>
  );
}

export default App;
