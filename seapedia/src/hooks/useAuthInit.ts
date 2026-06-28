import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Verifies auth session once on app mount.
 * If localStorage says we're logged in, confirm with the server via GET /auth/profile.
 * Returns `true` when the check is done (regardless of outcome).
 */
export function useAuthInit() {
  const { setUser, logout, isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setReady(true);
      return;
    }

    api
      .get('/auth/profile')
      .then((res: any) => setUser(res.data))
      .catch(() => logout())
      .finally(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
