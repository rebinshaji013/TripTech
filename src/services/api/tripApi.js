// src/services/api/tripApi.js
import apiService from './apiService';

class TripApi {
  // Get today's trips
  async getTodaysTrips() {
    try {
      const response = await apiService.get('/trips/today');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get trip by ID
  async getTripById(tripId) {
    try {
      const response = await apiService.get(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new trip
  async createTrip(tripData) {
    try {
      const response = await apiService.post('/trips', tripData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update trip status
  async updateTripStatus(tripId, status) {
    try {
      const response = await apiService.patch(`/trips/${tripId}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add trip request
  async addTripRequest(tripId, requestData) {
    try {
      const response = await apiService.post(`/trips/${tripId}/requests`, requestData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get trip reviews
  async getTripReviews() {
    try {
      const response = await apiService.get('/trips/reviews');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      const status = error.response.status;

      return {
        message,
        status,
        isNetworkError: false,
        originalError: error,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'Network error: Unable to connect to server',
        status: 0,
        isNetworkError: true,
        originalError: error,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        isNetworkError: false,
        originalError: error,
      };
    }
  }
}

export default new TripApi();