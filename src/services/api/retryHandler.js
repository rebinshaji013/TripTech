// src/services/api/retryHandler.js
class RetryHandler {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  // Exponential backoff delay
  getDelay(retryCount) {
    return Math.min(this.baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
  }

  // Check if request should be retried
  shouldRetry(error) {
    // Retry on network errors or 5xx status codes
    if (!error.response) {
      return true; // Network error
    }

    const status = error.response.status;
    return status >= 500 || status === 429; // Server errors or rate limiting
  }

  // Execute request with retry logic
  async execute(requestFn, config = {}) {
    const maxRetries = config.maxRetries || this.maxRetries;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        return response;
      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (attempt < maxRetries && this.shouldRetry(error)) {
          const delay = this.getDelay(attempt);
          console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    throw lastError;
  }
}

export default RetryHandler;