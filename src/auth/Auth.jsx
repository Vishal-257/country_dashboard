import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mock_token');
    if (token) {
      setUser({ email: 'user@example.com', token });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockToken = JSON.stringify({
      header: "header",
      payload: { email, id: Date.now() },
      signature: Math.random().toString(36).substring(7)
    });

    localStorage.setItem('mock_token', mockToken);
    setUser({ email, token: mockToken });
  };

  const logout = () => {
    localStorage.removeItem('mock_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};