// API Configuration
const getApiBaseUrl = (): string => {
  // Your actual backend (HTTP)
  return 'http://192.168.0.251:3001';

// For production deployment, use HTTPS
// return 'https://your-backend-domain.com';

};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  bugReports: `${API_BASE_URL}/api/bug-reports`,
  suggestions: `${API_BASE_URL}/api/add-suggestion`,
} as const;

// Helper function for making API requests with proper error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        // Add any common headers here if needed
      },
    });
    
    return response;
  } catch (error) {
    // Show detailed error in app for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorMsg = `❌ Network Error:\n${errorMessage}\nEndpoint: ${endpoint}`;
    alert(errorMsg);
    console.error('API request failed:', error);
    throw error;
  }
};