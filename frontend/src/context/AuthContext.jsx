import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const data = await api.get("/auth/user");
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const data = await api.post("/auth/login", { email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        await loadUser();
      }
    } catch (err) {
      throw new Error(err.message || "Login failed.");
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.post("/auth/register", { name, email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        await loadUser();
      }
    } catch (err) {
      throw new Error(err.message || "Registration failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
