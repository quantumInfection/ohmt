'use client';

import * as React from 'react';
import { logger } from '@/lib/default-logger';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import TokenManager from './tokenManager';

export const UserContext = React.createContext(undefined);

export function UserProvider({ children }) {
  const [supabaseClient] = React.useState(createSupabaseClient());

  const [state, setState] = React.useState({
    user: null,
    error: null,
    isLoading: true,
    accessToken: null,
  });

  React.useEffect(() => {
    function handleInitialSession(session) {
      const user = session?.user;
      const accessToken = session?.access_token;

      setState((prev) => ({
        ...prev,
        user: user
          ? {
            id: user.id ?? undefined,
            email: user.email ?? undefined,
            name: user.user_metadata?.full_name ?? undefined,
            avatar: user.user_metadata?.avatar_url ?? undefined,
          }
          : null,
        accessToken: accessToken ?? null,
        error: null,
        isLoading: false,
      }));

      // Store the token in the module
      TokenManager.setToken(accessToken);
    }

    function handleSignedIn(session) {
      const user = session?.user;
      const accessToken = session?.access_token;

      setState((prev) => ({
        ...prev,
        user: user
          ? {
            id: user.id ?? undefined,
            email: user.email ?? undefined,
            name: user.user_metadata?.full_name ?? undefined,
            avatar: user.user_metadata?.avatar_url ?? undefined,
          }
          : null,
        accessToken: accessToken ?? null,
        error: null,
        isLoading: false,
      }));

      // Store the token in the module
      TokenManager.setToken(accessToken);
    }

    function handleSignedOut() {
      setState((prev) => ({ ...prev, user: null, accessToken: null, error: null, isLoading: false }));

      // Clear the token in the module
      TokenManager.setToken(null);
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      logger.debug('[Auth] onAuthStateChange:', event, session);

      if (event === 'INITIAL_SESSION') {
        handleInitialSession(session);
      }

      if (event === 'SIGNED_IN') {
        handleSignedIn(session);
      }

      if (event === 'SIGNED_OUT') {
        handleSignedOut();
      }

      if (event === 'TOKEN_REFRESHED') {
        handleSignedIn(session);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabaseClient]);

  return <UserContext.Provider value={{ ...state }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
