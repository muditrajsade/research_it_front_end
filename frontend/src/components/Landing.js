import React from 'react';
import SearchBar from './SearchBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4 tracking-tight">
            RESEARCHIT
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2 font-light">
            Discover Knowledge, Explore Research
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Your gateway to academic papers, research articles, and scholarly content
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-4xl mb-12">
          <SearchBar onSearch={() => {}} />
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Computer Science', 'Medicine', 'Physics', 'Biology', 'Psychology'].map((topic) => (
            <button
              key={topic}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full border border-gray-200 hover:bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300 text-sm font-medium"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-center">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
            <div className="text-gray-600">Research Papers</div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">500K+</div>
            <div className="text-gray-600">Active Researchers</div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">Academic Fields</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-gray-400 text-sm">
          Empowering research since 2024
        </p>
      </div>
    </div>
  );
};

export default Index;
