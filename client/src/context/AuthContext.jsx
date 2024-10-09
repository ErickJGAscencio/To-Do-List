import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../api/todolist.api';
import { loginUser } from "../api/todolist.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState(null);
  const [section, setSection] = useState("Home");

  useEffect(() => {
    async function checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getUserProfile(token);
          setUsername(res.data.username);
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    checkLoginStatus();
  });

  const login = async (username, password) => {
    const res = await loginUser(username, password);
    console.log(res);
    localStorage.setItem('token', res.data.token);
    setUsername(res.data.username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, section, setSection, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}