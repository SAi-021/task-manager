import { createContext, useContext, useEffect, useState } from "react";
import { api, tokenStore } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, if we have a token, fetch the current user.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        tokenStore.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (data) => {
    tokenStore.set(data.access_token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    handleAuth(data);
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    handleAuth(data);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
