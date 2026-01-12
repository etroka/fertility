import { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, createUser, saveHealthData, getHealthData } from './db';
import { hashPassword, verifyPassword, encryptData, decryptData } from './crypto';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(null); // Kept in memory for encryption

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedUserId && storedEmail) {
      getUserByEmail(storedEmail).then((userData) => {
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, pwd, userData) => {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password for authentication
      const { hash, salt } = await hashPassword(pwd);

      // Create user
      const newUser = await createUser({
        email,
        passwordHash: hash,
        passwordSalt: salt,
        ...userData
      });

      // Store password in memory for encryption
      setPassword(pwd);

      // Encrypt and save health data
      const encryptedHealth = await encryptData(userData.healthData, pwd);
      await saveHealthData(newUser.id, userData.healthData, encryptedHealth);

      // Store user session
      localStorage.setItem('userId', newUser.id);
      localStorage.setItem('userEmail', email);

      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, pwd) => {
    try {
      const userData = await getUserByEmail(email);

      if (!userData) {
        throw new Error('User not found');
      }

      // Verify password
      const isValid = await verifyPassword(pwd, userData.passwordHash, userData.passwordSalt);

      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Store password in memory for encryption
      setPassword(pwd);

      // Store user session
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userEmail', email);

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setUser(null);
    setPassword(null);
  };

  const getEncryptedHealthData = async () => {
    if (!user || !password) return null;

    try {
      const data = await getHealthData(user.id);
      if (!data) return null;

      return await decryptData(data.encryptedData, password);
    } catch (error) {
      console.error('Error decrypting health data:', error);
      throw error;
    }
  };

  const updateHealthData = async (newHealthData) => {
    if (!user || !password) return;

    try {
      const encryptedHealth = await encryptData(newHealthData, password);
      await saveHealthData(user.id, newHealthData, encryptedHealth);
    } catch (error) {
      console.error('Error updating health data:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    getEncryptedHealthData,
    updateHealthData,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
