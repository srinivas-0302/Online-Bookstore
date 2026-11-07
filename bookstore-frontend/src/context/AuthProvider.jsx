import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest } from "../api/authApi";

function readSavedUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem("token") ? readSavedUser() : null
  );

  const login = useCallback(async (email, password) => {
    const response = await loginRequest({ email, password });
    const { token, ...userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Changes some details of the logged-in user (for example the name) everywhere
  const updateUser = useCallback(
    (changes) => {
      if (!user) return;
      const updated = { ...user, ...changes };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    },
    [user]
  );

  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      isCustomer: user?.role === "CUSTOMER",
      login,
      logout,
      updateUser,
    }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}