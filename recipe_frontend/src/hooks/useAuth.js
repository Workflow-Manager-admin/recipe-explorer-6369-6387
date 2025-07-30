import { useState, useEffect } from 'react';
import { recipeApi } from '../api/recipeApi';

// PUBLIC_INTERFACE
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeApi.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(data) {
    const user = await recipeApi.login(data);
    setUser(user);
  }
  async function register(data) {
    const user = await recipeApi.register(data);
    setUser(user);
  }
  async function logout() {
    await recipeApi.logout();
    setUser(null);
  }

  return { user, loading, login, register, logout, setUser };
}
