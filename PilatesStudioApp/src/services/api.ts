import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Class, 
  Booking, 
  CreateBookingRequest,
  ApiError 
} from '../types';
import { CONFIG } from '../utils/config';

const API_BASE_URL = CONFIG.API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.multiRemove(['authToken', 'user']);
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Authentication
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['user', JSON.stringify(user)]
      ]);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token and user data
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['user', JSON.stringify(user)]
      ]);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'user']);
  }

  // Classes
  static async getClasses(date?: string): Promise<Class[]> {
    try {
      const params = date ? { date } : {};
      const response = await api.get<Class[]>('/classes', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getClassById(id: number): Promise<Class> {
    try {
      const response = await api.get<Class>(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bookings
  static async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await api.post<Booking>('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getUserBookings(): Promise<Booking[]> {
    try {
      const response = await api.get<Booking[]>('/bookings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getBookingById(id: number): Promise<Booking> {
    try {
      const response = await api.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async cancelBooking(id: number): Promise<void> {
    try {
      await api.delete(`/bookings/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private static handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        return {
          message: error.response.data.message || 'An error occurred',
          errors: error.response.data.errors
        };
      }
      return {
        message: error.message || 'Network error occurred'
      };
    }
    return {
      message: 'An unexpected error occurred'
    };
  }
}

export default ApiService;