
// src/components/SearchBar.js - Updated SearchBar component
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const SearchBar = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  let navigate = useNavigate();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query);
      let rfd = await fetch('http://localhost:8000/auto-search',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query
        })
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
          let pl = {title:title,abstract:abstract,arxiv_id:rf.arxiv_id};
          plm.push(pl);
        }
      }
      navigate('/papers',{
        state: {
          data: plm
        }
      });
      // You can plug your search logic here
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {isLoading ? (
            <Loader2 className="ml-6 text-blue-500 animate-spin" size={20} />
          ) : (
            <Search className="ml-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={20} />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers, articles, or topics..."
            className="flex-1 px-4 py-4 text-lg outline-none placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
