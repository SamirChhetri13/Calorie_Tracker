import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("nutripulse_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await authApi.getMe();
      if (data?.success) {
        setUser(data.data.user);
        setHealthProfile(data.data.healthProfile);
      }
    } catch (err) {
      console.error("[AuthContext Error]", err);
      localStorage.removeItem("nutripulse_token");
      setUser(null);
      setHealthProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    if (data?.success) {
      localStorage.setItem("nutripulse_token", data.data.accessToken);
      setUser(data.data.user);
      await fetchUser();
    }
    return data;
  };

  const register = async (userData) => {
    const { data } = await authApi.register(userData);
    if (data?.success) {
      localStorage.setItem("nutripulse_token", data.data.accessToken);
      setUser(data.data.user);
      await fetchUser();
    }
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem("nutripulse_token");
      setUser(null);
      setHealthProfile(null);
    }
  };

  const updateProfileState = (newProfile) => {
    setHealthProfile(newProfile);
    if (user) {
      setUser((prev) => ({ ...prev, hasCompletedOnboarding: true }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        healthProfile,
        loading,
        isAuthenticated: !!user,
        hasProfile: !!healthProfile,
        login,
        register,
        logout,
        fetchUser,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
