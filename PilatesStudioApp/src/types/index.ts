export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface Class {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  availableSpots: number;
  price: number;
  classTypeName: string;
  instructorName: string;
  studioName: string;
}

export enum BookingStatus {
  Confirmed = 0,
  Cancelled = 1,
  Completed = 2,
  NoShow = 3
}

export interface Booking {
  id: number;
  bookingDate: string;
  status: BookingStatus;
  notes?: string;
  class: Class;
}

export interface CreateBookingRequest {
  classId: number;
  notes?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ClassDetail: { classId: number };
};

export type MainTabParamList = {
  Classes: undefined;
  Bookings: undefined;
  Profile: undefined;
};