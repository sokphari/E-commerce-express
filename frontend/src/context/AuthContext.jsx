import { useMemo, useState } from "react";
import { api, getStoredUser, setStoredSession } from "../api/client";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  async function login(input) {
    const response = await api.login(input);
    setStoredSession(response.data);
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(input) {
    const response = await api.register(input);
    setStoredSession(response.data);
    setUser(response.data.user);
    return response.data.user;
  }

  function logout() {
    setStoredSession(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
