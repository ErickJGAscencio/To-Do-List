import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/todolist.api';
import { loginUser } from "../services/todolist.api";
import { useContext } from 'react';
import { UserDataContext } from './UserDataContext';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const {saveDataUser} = useContext(UserDataContext)

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
          saveDataUser(res.data);
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
  },[isLoggedIn]);

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