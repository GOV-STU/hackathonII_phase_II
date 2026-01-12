/**
 * API client for authentication operations.
 * Provides HTTP client functions for signup and login.
 */

import { User, UserCreate, UserLogin } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Sign up a new user.
 */
export async function signup(userData: UserCreate): Promise<User> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to sign up');
  }

  return response.json();
}

/**
 * Log in an existing user.
 */
export async function login(loginData: UserLogin): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to log in');
  }

  return response.json();
}

/**
 * Store user data in localStorage.
 */
export function storeUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Get stored user data from localStorage.
 */
export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Remove user data from localStorage.
 */
export function clearStoredUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

/**
 * Check if user is authenticated.
 */
export function isAuthenticated(): boolean {
  return getStoredUser() !== null;
}
