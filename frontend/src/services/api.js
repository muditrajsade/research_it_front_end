// src/services/api.js - API service for backend communication
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Search papers
  async searchPapers(query, options = {}) {
    const payload = {
      query,
      top_k: options.topK || 10,
      search_mode: options.searchMode || 'balanced',
      fetch_metadata: options.fetchMetadata !== false,
    };

    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Smart search
  async smartSearch(query, options = {}) {
    const payload = {
      query,
      top_k: options.topK || 10,
      min_good_results: options.minGoodResults || 3,
      fetch_metadata: options.fetchMetadata !== false,
    };

    return this.request('/smart-search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Compare search modes
  async compareSearchModes(query, options = {}) {
    const payload = {
      query,
      top_k: options.topK || 10,
      fetch_metadata: options.fetchMetadata !== false,
    };

    return this.request('/compare-modes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Get system stats
  async getStats() {
    return this.request('/stats');
  }
}

export const apiService = new ApiService();
