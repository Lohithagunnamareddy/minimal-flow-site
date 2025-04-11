
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
}

// Define registration data type
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration (in a real app, this would come from a database)
const DEMO_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    firstName: 'Sam',
    lastName: 'Student',
    role: 'student' as const,
    department: 'cs',
  },
  {
    id: '2',
    email: 'faculty@example.com',
    password: 'password123',
    firstName: 'Frank',
    lastName: 'Faculty',
    role: 'faculty' as const,
    department: 'cs',
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Admin',
    role: 'admin' as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Login function - in a real app, this would make an API request
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user (this is just for demo - in a real app this would be a backend call)
      const foundUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Simulate JWT token storage (in a real app, the token would come from the backend)
      localStorage.setItem('token', 'demo-jwt-token');
      
      return userWithoutPassword;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function - in a real app, this would make an API request
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (DEMO_USERS.some(user => user.email === data.email)) {
        throw new Error('Email already exists');
      }
      
      // In a real app, this would send the data to your API
      console.log('Registering user:', data);
      
      // For demo purposes, we don't actually store the new user
      return true;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
