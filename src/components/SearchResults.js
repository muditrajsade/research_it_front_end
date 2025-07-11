import React from 'react';
import { Clock, User, Tag, ExternalLink, Star } from 'lucide-react';

const SearchResults = ({ results, searchTime, query, mode, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Searching papers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600 font-medium">Search Error</div>
        </div>
        <div className="mt-2 text-red-700">{error}</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No papers found for "{query}"</div>
        <div className="text-gray-400 mt-2">Try different keywords or search terms</div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score > 0.8) return 'text-green-600 bg-green-100';
    if (score > 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score > 0.8) return '🔥';
    if (score > 0.7) return '✅';
    return '⚠️';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-blue-800 font-medium">
              Found {results.length} papers for "{query}"
            </div>
            <div className="flex items-center text-blue-600 text-sm">
              <Clock size={16} className="mr-1" />
              {searchTime?.toFixed(0)}ms
            </div>
            {mode && (
              <div className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                {mode} mode
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Score and ArXiv ID */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getScoreIcon(result.score)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                  Score: {result.score.toFixed(4)}
                </span>
                <span className="text-blue-600 font-mono text-sm">
                  {result.arxiv_id}
                </span>
              </div>
              <a
                href={`https://arxiv.org/abs/${result.arxiv_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink size={16} className="mr-1" />
                View Paper
              </a>
            </div>

            {/* Paper Details */}
            {result.metadata ? (
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                  {result.metadata.title}
                </h3>

                {/* Authors */}
                {result.metadata.authors && result.metadata.authors.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="text-sm">
                      {result.metadata.authors.slice(0, 3).join(', ')}
                      {result.metadata.authors.length > 3 && 
                        ` et al. (${result.metadata.authors.length} authors)`
                      }
                    </span>
                  </div>
                )}

                {/* Published Date and Categories */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {result.metadata.published && (
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(result.metadata.published).toLocaleDateString()}
                    </div>
                  )}
                  {result.metadata.categories && result.metadata.categories.length > 0 && (
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      {result.metadata.categories.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>

                {/* Abstract */}
                {result.metadata.abstract && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-700 leading-relaxed">
                      {result.metadata.abstract.length > 300
                        ? `${result.metadata.abstract.substring(0, 300)}...`
                        : result.metadata.abstract
                      }
                    </div>
                  </div>
                )}

                {/* DOI and Journal */}
                <div className="flex items-center space-x-4 text-sm">
                  {result.metadata.doi && (
                    <a
                      href={`https://doi.org/${result.metadata.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      DOI: {result.metadata.doi}
                    </a>
                  )}
                  {result.metadata.journal_ref && (
                    <span className="text-gray-600">
                      Journal: {result.metadata.journal_ref}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Metadata not available for this paper
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
