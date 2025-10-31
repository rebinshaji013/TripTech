// src/services/api/apiService.js
import apiClient from './config';
import RetryHandler from './retryHandler';

const retryHandler = new RetryHandler(3, 1000);

class ApiService {
  constructor() {
    this.retryHandler = retryHandler;
  }

  // Generic request method with retry
  async request(config) {
    return this.retryHandler.execute(() => apiClient(config));
  }

  // GET request
  async get(url, config = {}) {
    return this.request({
      method: 'GET',
      url,
      ...config,
    });
  }

  // POST request
  async post(url, data = {}, config = {}) {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  // PUT request
  async put(url, data = {}, config = {}) {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  // DELETE request
  async delete(url, config = {}) {
    return this.request({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  // PATCH request
  async patch(url, data = {}, config = {}) {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }
}

export default new ApiService();