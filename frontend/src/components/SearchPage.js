import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { apiService } from '../services/api';

const SearchPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  // Check system health on mount
  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const health = await apiService.healthCheck();
      setSystemHealth(health);
    } catch (err) {
      console.error('System health check failed:', err);
      setError('Backend service unavailable. Please try again later.');
    }
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await apiService.smartSearch(query, {
        topK: 10,
        fetchMetadata: true,
      });

      setSearchResults(response.results);
      setSearchInfo({
        query: response.query,
        searchTime: response.search_time_ms,
        modeUsed: response.mode_used,
        totalResults: response.total_results,
      });
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get initial query from URL params if available
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      handleSearch(query);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RESEARCHIT
              </h1>
              {systemHealth && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-600">
                    {systemHealth.gpu_count > 0 ? `${systemHealth.gpu_count} GPU` : 'CPU'} Ready
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <SearchResults
          results={searchResults}
          searchTime={searchInfo?.searchTime}
          query={searchInfo?.query}
          mode={searchInfo?.modeUsed}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default SearchPage;