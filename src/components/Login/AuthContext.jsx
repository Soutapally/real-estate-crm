import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Load user from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // ✅ LOG HERE
        console.log("🔐 Loaded user from storage:", parsedUser);
      }
    } catch (err) {
      console.error("Failed to parse stored user", err);
      localStorage.removeItem("user");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ✅ Login
  const login = (userData) => {
    console.log("✅ Login called with:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout
  const logout = () => {
    console.log("🚪 Logout called");
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
