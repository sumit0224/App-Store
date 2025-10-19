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
  async getDeveloperApps(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dev/apps${queryString ? `?${queryString}` : ''}`);
  }

  async getDeveloperStats() {
    return this.request('/dev/stats');
  }

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

  // ChatBot endpoints
  async sendChatMessage(message, context = 'app_store') {
    return this.request('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async getChatSuggestions(page = 'home') {
    return this.request(`/chatbot/suggestions?page=${page}`);
  }

  // Profile endpoints
  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(imageFile) {
    // First get upload URL
    const uploadData = await this.request('/profile/upload-url', {
      method: 'POST',
      body: JSON.stringify({ 
        filename: imageFile.name,
        contentType: imageFile.type 
      }),
    });

    // Upload file to S3
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const uploadResponse = await fetch(uploadData.uploadUrl, {
      method: 'PUT',
      body: imageFile,
      headers: {
        'Content-Type': imageFile.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    return {
      url: uploadData.fileUrl,
      key: uploadData.key
    };
  }

  async getProfile() {
    return this.request('/profile');
  }

  async deleteProfile() {
    return this.request('/profile', {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
