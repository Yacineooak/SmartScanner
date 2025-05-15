import { User } from '../types/user';
import { delay } from '../lib/utils';

// Mock user for development
const MOCK_USER: User = {
  id: 'user-001',
  username: 'admin',
  email: 'admin@example.com',
  createdAt: new Date().toISOString(),
};

export async function loginUser(email: string, password: string): Promise<User> {
  // Simulate API call delay
  await delay(1000);
  
  // For development, always return success with mock user
  if (email && password) {
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }
  
  throw new Error('Invalid credentials');
}

export async function registerUser(
  username: string, 
  email: string, 
  password: string
): Promise<User> {
  // Simulate API call delay
  await delay(1500);
  
  // For development, always return success with mock user
  if (username && email && password) {
    const user = { ...MOCK_USER, username, email };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  
  throw new Error('Registration failed');
}

export async function logoutUser(): Promise<void> {
  // Simulate API call delay
  await delay(500);
  
  localStorage.removeItem('user');
}

export async function getCurrentUser(): Promise<User | null> {
  // Get user from localStorage
  const userJson = localStorage.getItem('user');
  
  if (userJson) {
    return JSON.parse(userJson) as User;
  }
  
  return null;
}