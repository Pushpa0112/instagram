import axios, { AxiosError, AxiosResponse } from 'axios';

// Default base URL fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiError {
  message: string;
  status: number;
  success?: boolean;
}

// Response interceptor to normalize errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      
      const data = error.response.data as any;
      if (data && typeof data.message === 'string') {
        errorMessage = data.message;
      } else {
        errorMessage = `Error ${statusCode}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
      statusCode = 0;
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    const normalizedError: ApiError = {
      message: errorMessage,
      status: statusCode,
      success: false,
    };

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
