import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../api/todolist.api';
import { loginUser } from "../api/todolist.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getUserProfile(token);
          setUsername(res.data.username);
          setUserId(res.data.id);
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    checkLoginStatus();
  });

  const login = async (username, password) => {
    try {
      const res = await loginUser(username, password);
      localStorage.setItem('token', res.data.token);
      setUsername(res.data.username);
      setIsLoggedIn(true);
      setError(null);
    } catch (error) {
      setError("Invalid username or password"); 
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}