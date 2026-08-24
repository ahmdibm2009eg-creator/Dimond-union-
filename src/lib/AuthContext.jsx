import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ isAuthenticated: true }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
