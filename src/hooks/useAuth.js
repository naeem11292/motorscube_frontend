import { useCallback } from "react";

const TOKEN_KEY = "motorscube_token";

export function useAuth() {
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const isAuthenticated = Boolean(
    localStorage.getItem(TOKEN_KEY)
  );

  return {
    logout,
    isAuthenticated,
  };
}