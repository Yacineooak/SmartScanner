import { v4 as uuidv4 } from 'uuid';

// Mock token storage (use Redis or similar in production)
const tokens = new Map();

// Login handler
export const login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // In a real app, verify credentials against database
  // For demo, accept any login with both email and password
  
  const userId = 'user-001';
  const token = uuidv4();
  
  // Store token (in memory for demo)
  tokens.set(token, { userId, email });
  
  // Return user info and token
  res.status(200).json({
    id: userId,
    username: 'admin', // Hard-coded for demo
    email,
    token,
    createdAt: new Date().toISOString(),
  });
};

// Register handler
export const register = (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Username, email, and password are required'
    });
  }
  
  // In a real app, check if user exists and create new user
  // For demo, accept any registration
  
  const userId = uuidv4();
  const token = uuidv4();
  
  // Store token (in memory for demo)
  tokens.set(token, { userId, email });
  
  // Return user info and token
  res.status(201).json({
    id: userId,
    username,
    email,
    token,
    createdAt: new Date().toISOString(),
  });
};

// Logout handler
export const logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    tokens.delete(token);
  }
  
  res.status(200).json({ message: 'Logged out successfully' });
};