// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AnimeDetails from './pages/info/[id]';
import './index.css'; // Import your global CSS here if any
import WatchPage from './pages/watch/[id]';
import Genres from './pages/genres/[id]';
import Search from './pages/search/[id]';
import About from './pages/About';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info/:id" element={<AnimeDetails />} />
        <Route path="/watch/:id" element={<WatchPage />} />
         <Route path="/genres/:id" element={<Genres />} />
         <Route path="/search/:id" element={<Search />} />
         <Route path="/about" element={<About />} />


         
      </Routes>
    </Router>
  );
};

export default App;
