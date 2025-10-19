// services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async signup(name, email, password, role = 'user') {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  // Apps endpoints
  async getApps(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/apps${queryString ? `?${queryString}` : ''}`);
  }

  async getApp(slug) {
    return this.request(`/apps/${slug}`);
  }

  async searchApps(query) {
    return this.request(`/apps/search?q=${encodeURIComponent(query)}`);
  }

  async addReview(appId, rating, title, body) {
    return this.request(`/apps/${appId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, title, body }),
    });
  }

  async downloadApp(appId) {
    return this.request(`/apps/${appId}/download`, {
      method: 'POST',
    });
  }

  // Developer endpoints
  async createApp(appData) {
    return this.request('/dev/apps', {
      method: 'POST',
      body: JSON.stringify(appData),
    });
  }

  async getUploadUrl(appId, filename, contentType) {
    return this.request(`/dev/apps/${appId}/upload-url`, {
      method: 'POST',
      body: JSON.stringify({ filename, contentType }),
    });
  }

  async completeUpload(appId, key, versionNumber) {
    return this.request(`/dev/apps/${appId}/complete-upload`, {
      method: 'POST',
      body: JSON.stringify({ key, versionNumber }),
    });
  }

  async publishApp(appId) {
    return this.request(`/dev/apps/${appId}/publish`, {
      method: 'POST',
    });
  }
}

export default new ApiService();
